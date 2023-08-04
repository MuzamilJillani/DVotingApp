import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import ProgressBar from "react-bootstrap/ProgressBar";

const Votes = ({ contract }) => {
  const [votes, setVotes] = useState([]);
  const gateway = "https://gateway.pinata.cloud/";

  useEffect(() => {
    if (!contract) return;

    const filter = contract.filters.VoteCreated();
    contract
      .queryFilter(filter)
      .then((result) => {
        setVotesData(result);
      })
      .catch((error) => console.log(error));
  }, [contract]);

  const handleVote = async (voteId, optionIdx) => {
    await contract
      .vote(voteId, optionIdx)
      .then(() => alert("success"))
      .catch((error) => alert(error.message));
  };

  const setVotesData = async (votesEvent) => {
    const promises = [];
    const newVotes = [];

    for (const vote of votesEvent) {
      const { owner, voteId, endTime, timestamp } = vote.args;
      const promise = contract.getVoteInfo(voteId).then(async (voteData) => {
        const uri = voteData[1];
        if (!uri) return;

        const currentVotesNumber = voteData[2].map((num) => Number(num));

        const newVote = {
          owner: owner,
          id: Number(voteId),
          votes: currentVotesNumber,
          endTime: Number(endTime),
          createdAt: Number(timestamp),
          totalVotes: currentVotesNumber.reduce((sum, val) => sum + val, 0),
        };

        try {
          await fetch(gateway + uri)
            .then((result) => result.json())
            .then((data) => {
              newVote.description = data.description;
              newVote.options = data.options;
              newVotes.push(newVote);
            });
        } catch {}
      });

      promises.push(promise);
    }

    await Promise.all(promises);
    setVotes(newVotes);
    console.log(votes);
  };

  return (
    <div>
      {votes.map((vote) => (
        <Card key={vote.id} className="my-2">
          <Card.Header>{vote.description}</Card.Header>
          <Card.Body>
            {vote.options.map((option, idx) => (
              <div className="mt-1" key={Math.random() + idx}>
                <p>
                  {option}:{" "}
                  {(vote.votes[idx] / Math.max(1, vote.totalVotes)) * 100}%
                </p>
                <div className="d-flex w-100 align-items-center">
                  <ProgressBar
                    now={(vote.votes[idx] / Math.max(1, vote.totalVotes)) * 100}
                    label={`${vote.votes[idx]}`}
                    className="w-100 me-2"
                  />
                  <Button
                    size="sm"
                    variant="dark"
                    onClick={() => {
                      handleVote(vote.id, idx);
                    }}
                  >
                    Vote
                  </Button>
                </div>
              </div>
            ))}
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default Votes;
