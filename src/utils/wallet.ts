import { BaseProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum: BaseProvider;
  }
}

export const BLOCKCHAIN = {
  id: process.env.REACT_APP_CHAIN_ID,
  name: process.env.REACT_APP_CHAIN_NAME,
  url: process.env.REACT_APP_CHAIN_URL,
} as const;

const CURRENCY = {
  name: process.env.REACT_APP_CURRENCY_NAME,
  symbol: process.env.REACT_APP_CURRENCY_SYMBOL,
  decimals: parseInt(process.env.REACT_APP_CURRENCY_DECIMALS!),
};

interface JsonRPCError {
  code: number;
}

/**
 * Get metamask provider
 */
export const getWallet = () => new Promise<BaseProvider>((resolve, reject) => {

  const handleEVM = () => {
    if (window.ethereum) {
      resolve(window.ethereum)
    } else {
      reject(new Error("You need Metamask!"));
    }
  };

  // Check https://docs.metamask.io/guide/mobile-best-practices.html#the-provider-window-ethereum
  if (window.ethereum) {
    handleEVM();
  } else {
    window.addEventListener('ethereum#initialized', handleEVM, {
      once: true,
    });
    // If the event is not dispatched by the end of the timeout,
    // the user probably doesn't have MetaMask installed.
    setTimeout(handleEVM, 3000); // 3 seconds
  }
})

/**
 * Check if current chain is Polygon
 */
export const isPolygonChain = async () => {
  const client = await getWallet();
  try {
    const chainId = await client.request({
      method: "eth_chainId",
      params: [{ chainId: BLOCKCHAIN.id }],
    });
    return chainId === BLOCKCHAIN.id;
  } catch (e) {
    throw Error("Cannot get chain id");
  }
};

/**
 * Try to connect to Polygon chain and if doesn't exist add the new chain to Metamask
 */
export const connectToPolygonChain = async () => {
  const client = await getWallet();
  try {
    // request account open mask estension
    await client.request({
      method: "eth_requestAccounts",
    });
    await client.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: BLOCKCHAIN.id }],
    });
  } catch (e) {
    // This error code indicates that the chain has not been added to MetaMask.
    if ((e as JsonRPCError).code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: BLOCKCHAIN.id,
              chainName: BLOCKCHAIN.name,
              rpcUrls: [BLOCKCHAIN.url],
              nativeCurrency: CURRENCY,
            },
          ],
        });
      } catch (err) {
        throw Error("Cannot connect to Polygon");
      }
    } else {
      throw Error("Cannot connect to Polygon");
    }
  }
};
