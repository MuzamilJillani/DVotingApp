pragma solidity ^0.8.9;

contract Voting {
    uint nextVoteId;

    struct Vote {
        address owner;
        string uri;
        uint[] votes;
        uint options;
        mapping(address => uint) vote;
        mapping(address => bool) hasVoted;
        uint endTime;
    }

    mapping(address => bool) public members;
    mapping(uint => Vote) votes;

    event Voted(address voter, uint voteId, uint option, uint timestamp);
    event VoteCreated(address owner, uint voteId, uint endTime, uint timestamp);
    event MemberJoined(address user, uint timestamp);

    modifier isMember() {
        require(members[msg.sender], "you are not a member");
        _;
    }

    modifier canVote(uint voteId, uint option) {
        require(votes[voteId].owner != address(0), "votes does not exist");
        require(option < votes[voteId].votes.length, "invalid option");
        require(votes[voteId].endTime >= block.timestamp, "voting has ended");
        require(!votes[voteId].hasVoted[msg.sender], "you have already voted");
        _;
    }

    function join() external {
        require(!members[msg.sender], "you are already a member");
        members[msg.sender] = true;
        emit MemberJoined(msg.sender, block.timestamp);
    }

    function createVote(
        string memory uri,
        uint options,
        uint endtime
    ) external isMember {
        require(
            options >= 2 && options <= 8,
            "no. of options should be between 2 and 8"
        );
        require(endtime > block.timestamp, "end time cannot be in the past");

        uint voteId = nextVoteId;

        votes[voteId].owner = msg.sender;
        votes[voteId].uri = uri;
        votes[voteId].endTime = endtime;
        votes[voteId].options = options;
        votes[voteId].votes = new uint[](options);

        nextVoteId++;
        emit VoteCreated(msg.sender, voteId, endtime, block.timestamp);
    }

    function vote(
        uint voteId,
        uint option
    ) external canVote(voteId, option) isMember {
        votes[voteId].hasVoted[msg.sender] = true;
        votes[voteId].vote[msg.sender] = option;
        emit Voted(msg.sender, voteId, option, block.timestamp);
    }

    function hasVoted(address user, uint voteId) public view returns (bool) {
        return votes[voteId].hasVoted[user];
    }

    function getVoteInfo(
        uint voteId
    ) public view returns (address, string memory, uint[] memory, uint) {
        return (
            votes[voteId].owner,
            votes[voteId].uri,
            votes[voteId].votes,
            votes[voteId].endTime
        );
    }

    function getUserVote(address user, uint voteId) public view returns (int) {
        if (hasVoted(user, voteId)) {
            return int(votes[voteId].vote[user]);
        }
        return -1;
    }
}
