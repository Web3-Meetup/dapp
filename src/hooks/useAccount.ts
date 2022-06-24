import { selectAddress } from './../store/features/wallet/walletSlice';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '~/store/hooks';
import useWeb3 from "~/hooks/useWeb3";
import { useEffect, useState } from "react";
import * as w3 from "~/utils/w3";
import { setAddress } from '~/store/features/wallet/walletSlice';


const useAccount = () => {
  const dispatch = useAppDispatch();
  const { connectionStatus } = useWeb3();
  const address = useSelector(selectAddress);

  const [error, setError] = useState<string | null>();

  useEffect(() => {
    if(connectionStatus !== "CONNECTED") {
      return;
    }
    (async () => {
      try {
        setError(null);
        const account = await w3.getAccount();
        dispatch(
          setAddress(account)
        )
      } catch (e) {
        setError("Wallet not available!");
      }
    })();
  }, [connectionStatus, dispatch]);

  return {
    error,
    address,
  };
};

export default useAccount;
