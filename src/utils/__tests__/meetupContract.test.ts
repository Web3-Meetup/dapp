import { mocked } from "jest-mock";
import { contract, getTopics, addTopic, likeTopic } from "../meetupContract";

jest.mock("~/utils/w3", () => ({
  web3Client: {
    eth: {
      Contract: jest.fn().mockImplementation(() => ({
        methods: {
          getTopicsCount: () => ({
            call: jest.fn(),
          }),
          topics: () => ({
            call: jest.fn(),
          }),
          addTopic: () => ({
            send: jest.fn()
          }),
          like: () => ({
            send: jest.fn()
          })
        },
      })),
    },
  },
}));

const mockedContractGetTopicsCount = jest.fn();
const mockedContractTopics = jest.fn();
const mockedContractAddTopic = jest.fn();
const mockedContractLikeTopic = jest.fn();

const mockedContract = mocked(contract);
mockedContract.methods.getTopicsCount = () => ({
  call: mockedContractGetTopicsCount,
});
mockedContract.methods.topics = () => ({
  call: mockedContractTopics,
});
mockedContract.methods.addTopic = () => ({
  send: mockedContractAddTopic
});
mockedContract.methods.like = () => ({
  send: mockedContractLikeTopic
})

describe("utils / meetupContract", () => {
  describe("getTopics", () => {
    it("should return a list of topics from smart contract", async () => {
      mockedContractGetTopicsCount.mockResolvedValue(2);
      // accessing a public array in a smart contract can be done just passing the index and retrieve one value on each call
      mockedContractTopics
        .mockResolvedValueOnce({
          user: "0x1234",
          likes: "4",
          message: "Sono Lillo",
        })
        .mockResolvedValueOnce({
          user: "0x4321",
          likes: "0",
          message: "LOL",
        });
      const topics = await getTopics();
      expect(topics).toStrictEqual([
        {
          user: "0x1234",
          likes: 4,
          message: "Sono Lillo",
        },
        {
          user: "0x4321",
          likes: 0,
          message: "LOL",
        },
      ]);
    });
    it("should throw an Error if smart contract call to topics count fails", async () => {
      mockedContractGetTopicsCount.mockRejectedValue(null);

      await expect(getTopics()).rejects.toThrow("Cannot get topics");
    });
    it("should throw an Error if smart contract call to topics fails", async () => {
      mockedContractGetTopicsCount.mockResolvedValue(2);

      mockedContractTopics.mockRejectedValue(null);

      await expect(getTopics()).rejects.toThrow("Cannot get topics");
    });
  });
  describe("addTopic", () => {
    it("should call smart contract addTopic properly", async () => {
      mockedContractAddTopic.mockResolvedValue(true);
      const spyAddTopic = jest.spyOn(mockedContract.methods, "addTopic");
      await addTopic("0x1234","New topic");
      expect(spyAddTopic).toHaveBeenCalledWith("New topic");
      expect(mockedContractAddTopic).toHaveBeenCalledWith({
        from: "0x1234",
        value: "500000000000000000" // 0.5 matic
      });
    })
    it("should throw an Error if smart contract call fails", async () => {
      mockedContractAddTopic.mockRejectedValue(null);

      await expect(addTopic("0x1234","New topic")).rejects.toThrow("Cannot add new topic");
    });
  })
  describe("likeTopic", () => {
    it("should call smart contract likeTopic properly", async () => {
      mockedContractLikeTopic.mockResolvedValue(true);
      const spyLikeTopic = jest.spyOn(mockedContract.methods, "like");
      await likeTopic("0x1234",1);
      expect(spyLikeTopic).toHaveBeenCalledWith(1);
      expect(mockedContractLikeTopic).toHaveBeenCalledWith({
        from: "0x1234",
        value: "100000000000000000" // 0.5 matic
      });
    })
    it("should throw an Error if smart contract call fails", async () => {
      mockedContractLikeTopic.mockRejectedValue(null);

      await expect(likeTopic("0x1234",1)).rejects.toThrow("Cannot like this topic");
    });
  })
});
