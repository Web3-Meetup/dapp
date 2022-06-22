import { Contract } from 'web3-eth-contract';
import { getBalance } from "~/utils/w3";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { Topic } from "~/store/features/meetup/types";
import {
  selectIsLoading,
  selectTopics,
  selectOrganizers,
  selectBalance,
  selectIsInitialized,
  setIsLoading,
  addTopic as addMeetupTopic,
  likeTopic as likeMeetupTopic,
  init as initMeetup,
  updateBalance,
} from "~/store/features/meetup/meetupSlice";
import * as meetupContract from "~/utils/meetupContract";
import { useState, useCallback, useRef } from "react";
import useAccount from "~/hooks/useAccount";
import { batch } from "react-redux";

interface Params {
  contractAddress?: string
}

const useMeetupContract = ({ contractAddress }: Params) => {
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const contract = useRef<Contract>();

  const isLoading = useAppSelector(selectIsLoading);
  const isInitialized = useAppSelector(selectIsInitialized);
  const topics = useAppSelector(selectTopics);
  const organizers = useAppSelector(selectOrganizers);
  const balance = useAppSelector(selectBalance);

  const { address: userAddress } = useAccount();

  const catchError = async (cb: VoidFunction) => {
    try {
      setError(null);
      await cb();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const addTopic = useCallback(
    async (topicMessage: Topic["message"]) => {
      const currentContract = contract.current;
      if (!userAddress || !currentContract) {
        return;
      }
      dispatch(setIsLoading(true));
      await catchError(async () => {
        await meetupContract.addTopic(currentContract, userAddress, topicMessage);
        const updatedBalance = await getBalance(
          currentContract.options.address
        );
        batch(() => {
          dispatch(
            addMeetupTopic({
              user: userAddress,
              message: topicMessage,
              likes: 0,
            })
          );
          dispatch(updateBalance(updatedBalance));
        });
      });
      dispatch(setIsLoading(false));
    },
    [userAddress, dispatch]
  );

  const likeTopic = useCallback(
    async (topicIndex: number) => {
      const currentContract = contract.current;
      if (!userAddress || !currentContract) {
        return;
      }
      dispatch(setIsLoading(true));
      await catchError(async () => {
        await meetupContract.likeTopic(currentContract, userAddress, topicIndex);
        const updatedBalance = await getBalance(
          currentContract.options.address
        );
        batch(() => {
          dispatch(likeMeetupTopic(topicIndex));
          dispatch(updateBalance(updatedBalance));
        });
      });
      dispatch(setIsLoading(false));
    },
    [userAddress, dispatch]
  );

  const withdrawBalance = useCallback(async () => {
    const currentContract = contract.current;
    if (!userAddress || !currentContract) {
      return;
    }
    dispatch(setIsLoading(true));
    await catchError(async () => {
      await meetupContract.withdrawBalance(currentContract, userAddress);
      const updatedBalance = await getBalance(
        currentContract.options.address
      );
      dispatch(updateBalance(updatedBalance));
    });
    dispatch(setIsLoading(false));
  }, [userAddress, dispatch]);

  const init = useCallback(async () => {
      if (isInitialized || !contractAddress) {
        return;
      }
      dispatch(setIsLoading(true));
      const newContract = meetupContract.init(contractAddress);
      await catchError(async () => {
        const topics = await meetupContract.getTopics(newContract);
        const organizers = await meetupContract.getOrganizers(newContract);
        const balance = await getBalance(
          newContract.options.address
        );
        contract.current = newContract;
        dispatch(initMeetup({ organizers, topics, balance }));
      });
      dispatch(setIsLoading(false));
  }, [dispatch, isInitialized, contractAddress]);

  return {
    isLoading,
    error,
    topics,
    organizers,
    balance,
    addTopic,
    likeTopic,
    withdrawBalance,
    init
  };
};

export default useMeetupContract;
