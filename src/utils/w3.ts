import Web3 from "web3";

export const web3Client = new Web3(Web3.givenProvider);

export const getAccount = async (index: number = 0) => {
  try {
    //@TODO use ens to check if user has an ens address, currenlty unsupported from web3.js
    const accounts = await web3Client.eth.getAccounts();
    return accounts[index];
  } catch (e) {
    throw Error("Cannot get account");
  }
};

export const getBalance = async (address: string) => {
  try {
    return Number(await web3Client.eth.getBalance(address));
  } catch (e) {
    throw Error("Cannot get balance");
  }
};
