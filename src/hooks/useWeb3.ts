import { useCallback, useEffect, useState } from "react";
import * as wallet from "~/utils/wallet";

type ConnectionStatus =
  | "NOT_CONNECTED" // user not connected to any chain
  | "CONNECTED" // user connected to Polygon chain
  | "PENDING" // user is connecting a chain
  | "WRONG_CHAIN"; // user is connected to a different chain (!= Polygon)

const useWeb3 = () => {
  const [isMetamaskAvailable, setIsMetamaskAvailable] = useState(false);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("NOT_CONNECTED");

  useEffect(() => {
    try {
      wallet.getWallet();
      setIsMetamaskAvailable(true);
    } catch (e) {
      setIsMetamaskAvailable(false);
    }
  }, []);

  // handle metamask connection
  useEffect(() => {
    if (isMetamaskAvailable) {
      const meta = wallet.getWallet();
      if (meta.isConnected()) {
        wallet.isPolygonChain().then((isPolygonChain) => {
          isPolygonChain
            ? setConnectionStatus("CONNECTED")
            : setConnectionStatus("WRONG_CHAIN");
        });
      }

      const handleClientConnect = ({ chainId }: { chainId: string }) => {
        if (chainId === wallet.BLOCKCHAIN.id) {
          setConnectionStatus("CONNECTED");
        } else {
          setConnectionStatus("WRONG_CHAIN");
        }
      };

      const handleClientDisconnect = ({ chainId }: { chainId: string }) => {
        if (chainId === wallet.BLOCKCHAIN.id) {
          setConnectionStatus("NOT_CONNECTED");
        }
      };

      const handleChangeChain = (chainId: string) => {
        if (chainId === wallet.BLOCKCHAIN.id) {
          setConnectionStatus("CONNECTED");
        } else {
          setConnectionStatus("WRONG_CHAIN");
        }
      };

      const handleChangedAccount = () => {
        // simplest solution, not so clean
        window.location.reload();
      };

      meta.on("connect", handleClientConnect);
      meta.on("disconnect", handleClientDisconnect);
      meta.on("chainChanged", handleChangeChain);
      meta.on("accountsChanged", handleChangedAccount);

      return () => {
        meta.removeListener("connect", handleClientConnect);
        meta.removeListener("disconnect", handleClientDisconnect);
        meta.removeListener("chainChanged", handleChangeChain);
        meta.removeListener("accountsChanged", handleChangedAccount);
      };
    }
  }, [isMetamaskAvailable]);

  const connectToChain = useCallback(() => {
    (async () => {
      try {
        setConnectionStatus("PENDING");
        await wallet.connectToPolygonChain();
      } catch (e) {
        alert((e as Error).message);
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
