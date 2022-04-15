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
import { useState, useCallback } from "react";
import useAccount from "~/hooks/useAccount";
import { batch } from "react-redux";

const useMeetupContract = () => {
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);

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
      if (userAddress) {
        dispatch(setIsLoading(true));
        await catchError(async () => {
          await meetupContract.addTopic(userAddress, topicMessage);
          const updatedBalance = await getBalance(
            meetupContract.contract.options.address
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
      }
    },
    [userAddress, dispatch]
  );

  const likeTopic = useCallback(
    async (topicIndex: number) => {
      if (userAddress) {
        dispatch(setIsLoading(true));
        await catchError(async () => {
          await meetupContract.likeTopic(userAddress, topicIndex);
          const updatedBalance = await getBalance(
            meetupContract.contract.options.address
          );
          batch(() => {
            dispatch(likeMeetupTopic(topicIndex));
            dispatch(updateBalance(updatedBalance));
          });
        });
        dispatch(setIsLoading(false));
      }
    },
    [userAddress, dispatch]
  );

  const withdrawBalance = useCallback(async () => {
    if (userAddress) {
      dispatch(setIsLoading(true));
      await catchError(async () => {
        await meetupContract.withdrawBalance(userAddress);
        const updatedBalance = await getBalance(
          meetupContract.contract.options.address
        );
        dispatch(updateBalance(updatedBalance));
      });
      dispatch(setIsLoading(false));
    }
  }, [userAddress, dispatch]);

  const init = useCallback(async () => {
      if (isInitialized) {
        return;
      }
      dispatch(setIsLoading(true));
      await catchError(async () => {
        const topics = await meetupContract.getTopics();
        const organizers = await meetupContract.getOrganizers();
        const balance = await getBalance(
          meetupContract.contract.options.address
        );

        dispatch(initMeetup({ organizers, topics, balance }));
      });
      dispatch(setIsLoading(false));
  }, [dispatch, isInitialized]);

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
