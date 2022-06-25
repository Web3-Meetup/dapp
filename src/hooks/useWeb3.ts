import { BaseProvider } from '@metamask/providers';
import { selectConnectionStatus } from './../store/features/wallet/walletSlice';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '~/store/hooks';
import { useCallback, useEffect, useState } from "react";
import { setConnectionStatus } from "~/store/features/wallet/walletSlice";
import * as wallet from "~/utils/wallet";

const useWeb3 = () => {
  const [isMetamaskAvailable, setIsMetamaskAvailable] = useState(false);
  const dispatch = useAppDispatch();
  const connectionStatus = useSelector(selectConnectionStatus);

  useEffect(() => {
    (async () => {
      try {
        await wallet.getWallet();
        setIsMetamaskAvailable(true);
      } catch (e) {
        setIsMetamaskAvailable(false);
      }
    })()
  }, []);

  // handle metamask connection
  useEffect(() => {
    let meta: BaseProvider;

    const handleClientConnect = ({ chainId }: { chainId: string }) => {
      if (chainId === wallet.BLOCKCHAIN.id) {
        dispatch(
          setConnectionStatus("CONNECTED")
        )
      } else {
        dispatch(
          setConnectionStatus("WRONG_CHAIN")
        )
      }
    };

    const handleClientDisconnect = ({ chainId }: { chainId: string }) => {
      if (chainId === wallet.BLOCKCHAIN.id) {
        dispatch(
          setConnectionStatus("NOT_CONNECTED")
        )
      }
    };

    const handleChangeChain = (chainId: string) => {
      if (chainId === wallet.BLOCKCHAIN.id) {
        dispatch(
          setConnectionStatus("CONNECTED")
        )
      } else {
        dispatch(
          setConnectionStatus("WRONG_CHAIN")
        )
      }
    };

    const handleChangedAccount = () => {
      // simplest solution, not so clean
      window.location.reload();
    };

    (async () => {
      if (isMetamaskAvailable) {
        meta = await wallet.getWallet();
        meta.on("connect", handleClientConnect);
        meta.on("disconnect", handleClientDisconnect);
        meta.on("chainChanged", handleChangeChain);
        meta.on("accountsChanged", handleChangedAccount);
        if (meta.isConnected()) {
          try {
            const isPolygonChain = await wallet.isPolygonChain();
            if (isPolygonChain) {
              return dispatch(
                setConnectionStatus("CONNECTED")
              )
            }
            return dispatch(
              setConnectionStatus("WRONG_CHAIN")
            )
          } catch(e) {
            dispatch(
              setConnectionStatus("NOT_CONNECTED")
            )
          }
        }
      }
    })();
   
    return () => {
      if(!meta) {
        return;
      }
      meta.removeListener("connect", handleClientConnect);
      meta.removeListener("disconnect", handleClientDisconnect);
      meta.removeListener("chainChanged", handleChangeChain);
      meta.removeListener("accountsChanged", handleChangedAccount);
    };
  }, [isMetamaskAvailable, dispatch]);

  const connectToChain = useCallback(() => {
    (async () => {
      try {
        setConnectionStatus("PENDING");
        await wallet.connectToPolygonChain();
        setConnectionStatus("CONNECTED");
      } catch (e) {
        setConnectionStatus("NOT_CONNECTED");
      }
    })();
  }, []);

  return {
    isMetamaskAvailable,
    connectionStatus,
    connectToChain,
  };
};

export default useWeb3;
