import { mocked } from 'jest-mock';
import { web3Client, getAccount, getBalance } from '../w3';

const mockedGetAccount = jest.fn();
const mockedGetBalance = jest.fn();
const mockedWeb3Client = mocked(web3Client);
mockedWeb3Client.eth.getAccounts = mockedGetAccount;
mockedWeb3Client.eth.getBalance = mockedGetBalance;

describe("utils / w3", () => {
  describe("getAccount", () => {
    it("should return the first account by default", async () => {
      mockedGetAccount.mockResolvedValue(["0x1234", "0x4321"])
      expect(await getAccount()).toEqual("0x1234");
    })
    it("should return the n-th account when index is passed", async () => {
      mockedGetAccount.mockResolvedValue(["0x1234", "0x4321"])
      expect(await getAccount(1)).toEqual("0x4321");
    })
    it("should throw an error if web3 client getAccounts fails", async () => {
      mockedGetAccount.mockRejectedValue(null);
      await expect(getAccount()).rejects.toThrow("Cannot get account");
    })
  })
  describe("getBalance", () => {
    it("should return the balance for given account address", async () => {
      mockedGetBalance.mockResolvedValue("1000");
      const balance = await getBalance("0x1234");
      expect(balance).toEqual(1000);
      expect(mockedGetBalance).toHaveBeenCalledWith("0x1234");
    })
    it("should throw an error if web3 client getBalance fails", async () => {
      mockedGetBalance.mockRejectedValue(null);
      await expect(getBalance("0x1234")).rejects.toThrow("Cannot get balance");
    })
  })
})