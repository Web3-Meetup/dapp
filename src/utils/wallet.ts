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
  decimals: process.env.REACT_APP_CURRENCY_DECIMALS,
};

interface JsonRPCError {
  code: number;
}

/**
 * Get metamask provider
 */
export const getWallet = () => {
  if (window.ethereum) {
    return window.ethereum;
  } else {
    throw Error("You need Metamask!");
  }
};

/**
 * Check if current chain is Polygon
 */
export const isPolygonChain = async () => {
  const client = getWallet();
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
  const client = getWallet();
  try {
    // request permission trigger open mask estension to open and insert password
    await client.request({
      method: "wallet_requestPermissions",
      params: [{ eth_accounts: {} }],
    });
    await client.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: BLOCKCHAIN.id }],
    });
  } catch (e) {
    // This error code indicates that the chain has not been added to MetaMask.
    if ((e as JsonRPCError).code === 4902) {
      try {
        return await window.ethereum.request({
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
