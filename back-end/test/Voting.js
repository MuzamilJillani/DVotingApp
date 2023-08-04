const { expect } = require("chai");

async function getTimestamp() {
  const blockNumber = await ethers.provider.getBlockNumber();
  const block = await ethers.provider.getBlock(blockNumber);
  return block.timestamp;
}

describe("Voting", function () {
  let owner;
  let addr1;
  let voting;

  before(async () => {
    [owner, addr1] = await ethers.getSigners();

    const Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy();
  });

  describe("Join", () => {
    it("can join for the first time", async () => {
      await expect(voting.join()).to.emit(voting, "MemberJoined");
    })
    it("member cannot join again", async () => {
      await expect(voting.join()).to.be.reverted;
    })
  })

  describe("Create Vote", () => {
    it("Non-member cannot create a vote", async () => {
      await expect(voting.connect(addr1).createVote("", 3, (await getTimestamp())+60)).to.be.reverted;
    })
    it("Options should not be less than 2", async () => {
      await expect(voting.createVote("", 1, (await getTimestamp())+60)).to.be.reverted;
    })
    it("Options should not be more than 8", async () => {
      await expect(voting.createVote("", 9, (await getTimestamp())+60)).to.be.reverted;
    })
    it("End time should not be in the past", async () => {
      await expect(voting.createVote("", 5, (await getTimestamp())-60)).to.be.reverted;
    })
    it("can create vote", async () => {
      expect(await voting.createVote("2", 5, (await getTimestamp()+60))).to.emit(voting, "VoteCreated");
    })
  })

  describe("Vote", () => {
    it("Cannot vote if not a member", async () => {
      await expect((voting).connect(addr1).vote(0,2)).to.be.reverted;
    })
    it("Cannot vote in invalid voting", async () => {
      await expect(voting.vote(1,2)).to.be.reverted;
    })
    it("Cannot vote for invalid option", async () => {
      await expect(voting.vote(0,5)).to.be.reverted;
    })
    it("Can vote", async () => {
      await expect(voting.vote(0,3)).to.emit(voting, "Voted");
    })
    it("Cannot vote twice", async () => {
      await expect(voting.vote(0,2)).to.be.reverted;
    })
    it("cannot vote if time is up", async () => {
      await voting.connect(addr1).join();
      await ethers.provider.send("evm_mine", [(await getTimestamp())+3600]);
      await expect(voting.connect(addr1).vote(0,3)).to.be.reverted;
    })
  })
});
