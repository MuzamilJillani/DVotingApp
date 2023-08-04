const ethers = require("ethers");

const address = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const abi = [
  "event MemberJoined(address user, uint256 timestamp)",
  "event VoteCreated(address owner, uint256 voteId, uint256 endTime, uint256 timestamp)",
  "event Voted(address voter, uint256 voteId, uint256 option, uint256 timestamp)",
  "function createVote(string uri, uint256 options, uint256 endtime)",
  "function getUserVote(address user, uint256 voteId) view returns (int256)",
  "function getVoteInfo(uint256 voteId) view returns (address, string, uint256[], uint256)",
  "function hasVoted(address user, uint256 voteId) view returns (bool)",
  "function join()",
  "function members(address) view returns (bool)",
  "function vote(uint256 voteId, uint256 option)",
];

const provider = new ethers.BrowserProvider(window.ethereum);

export const connect = async () => {
  await provider.send("eth_requestAccounts", []);
  return getContract();
};

export const getContract = async () => {
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(address, abi, signer);
  return { signer: signer, contract: contract };
};
