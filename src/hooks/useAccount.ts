import { useEffect, useState } from "react";
import * as w3 from "~/utils/w3";

const useAccount = () => {
  const [error, setError] = useState<string | null>();
  const [address, setAddress] = useState<string | null>();

  useEffect(() => {
    (async () => {
      try {
        setError(null);
        const account = await w3.getAccount();
        setAddress(account);
      } catch (e) {
        setError("Wallet not available!");
      }
    })();
  }, []);

  return {
    error,
    address,
  };
};

export default useAccount;
