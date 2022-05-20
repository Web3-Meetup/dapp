import meetupAbi from "~/abi/meetup";
import organizationAbi from "~/abi/organization"
import { web3Client } from "~/utils/w3";
import { toWei } from "web3-utils";
import { EventData } from 'web3-eth-contract';

const CONTRACT_ADDRESS = process.env.REACT_APP_MEETUP_CONTRACT_ADDRESS!;

const TOPIC_COST = process.env.REACT_APP_TOPIC_COST || "0.5";
const LIKE_COST = process.env.REACT_APP_LIKE_COST || "0.1";

export const MAX_TOPICS_COUNT = 10;

interface Topic {
  user: string;
  likes: number;
  message: string;
}

export const contract = new web3Client.eth.Contract(
  meetupAbi,
  CONTRACT_ADDRESS
);

export const getTopics = async (): Promise<Topic[]> => {
  try {
    const topicsCount = await contract.methods.getTopicsCount().call();
    const topics = [];
    for (let i = 0; i < Number(topicsCount); i++) {
      //@TODO add ens name for topic.user if exists (must wait for web3.js to support ens reverse lookup)
      const topic = await contract.methods.topics(i).call();
      topics.push({
        ...topic,
        likes: Number(topic.likes),
      });
    }
    return topics;
  } catch (e) {
    throw Error("Cannot get topics");
  }
};

export const addTopic = async (userAddress: string, message: string) => {
  try {
    await contract.methods.addTopic(message).send({
      from: userAddress,
      value: toWei(TOPIC_COST.toString()),
    });
  } catch (e) {
    throw Error("Cannot add new topic");
  }
};

export const likeTopic = async (userAddress: string, topicIndex: number) => {
  try {
    await contract.methods.like(topicIndex).send({
      from: userAddress,
      value: toWei(LIKE_COST.toString()),
    });
  } catch (e) {
    throw Error("Cannot like this topic");
  }
};

export const getOrganizers = async ():Promise<string[]> => {
  try {
    // @TODO maybe we can export getOrganizers directly from meetup contract to avoid double call client side
    const organizationContractAddress = await contract.methods.organization().call();
    const organizationContract = new web3Client.eth.Contract(
      organizationAbi,
      organizationContractAddress
    );
    return await organizationContract.methods.getOrganizers().call();
  }catch (e) {
    throw Error("Cannot get organizers");
  }
}

export const withdrawBalance = async (userAddress: string) => {
  try {
    await contract.methods.withdraw().send({
      from: userAddress,
    });
  }catch (e) {
    throw Error("Cannot withdraw, contact smart contract owner!");
  }
};

// Contract events use (err,data) callback approach. 
export const eventErrorDecorator = (fn: (data: EventData) => void) => {
  return (e: Error, data: EventData) => {
    if (e) {
      throw e;
    }
    return fn(data);
  };
};