import React, { useState } from "react";
import { ethers } from "ethers";
import { ThirdwebSDK } from "@3rdweb/sdk";

const { REACT_APP_TOKEN_ADDRESS, REACT_APP_NETWORK, REACT_APP_VOTE_ADDRESS } =
  process.env;

const sdk = new ThirdwebSDK(REACT_APP_NETWORK);
const tokenModule = sdk.getTokenModule(REACT_APP_TOKEN_ADDRESS);
const voteModule = sdk.getVoteModule(REACT_APP_VOTE_ADDRESS);

export const VoteForm = ({ proposals, hasVoted, setHasVoted, address }) => {
  const [isVoting, setIsVoting] = useState(false);

  const onSubmitVote = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsVoting(true);

    const votes = proposals.map((proposal) => {
      let voteResult = {
        proposalId: proposal.proposalId,
        vote: 2,
      };
      proposal.votes.forEach((vote) => {
        const elem = document.getElementById(
          proposal.proposalId + "-" + vote.type
        );

        if (elem.checked) {
          voteResult.vote = vote.type;
          return;
        }
      });
      return voteResult;
    });

    try {
      const delegation = await tokenModule.getDelegationOf(address);
      if (delegation === ethers.constants.AddressZero) {
        await tokenModule.delegateTo(address);
      }
      try {
        await Promise.all(
          votes.map(async (vote) => {
            const proposal = await voteModule.get(vote.proposalId);
            if (proposal.state === 1) {
              return voteModule.vote(vote.proposalId, vote.vote);
            }
            return;
          })
        );
        try {
          await Promise.all(
            votes.map(async (vote) => {
              const proposal = await voteModule.get(vote.proposalId);

              if (proposal.state === 4) {
                return voteModule.execute(vote.proposalId);
              }
            })
          );
          setHasVoted(true);
          console.log("successfully voted");
        } catch (err) {
          console.error("failed to execute votes", err);
        }
      } catch (err) {
        console.error("failed to vote", err);
      }
    } catch (err) {
      console.error("failed to delegate tokens");
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div>
      <h2>Active Proposals</h2>
      <form onSubmit={(e) => onSubmitVote(e)}>
        {proposals.map((proposal, index) => (
          <div key={proposal.proposalId} className="card">
            <h5>{proposal.description}</h5>
            <div>
              {proposal.votes.map((vote) => (
                <div key={vote.type}>
                  <input
                    type="radio"
                    id={proposal.proposalId + "-" + vote.type}
                    name={proposal.proposalId}
                    value={vote.type}
                    //default the "abstain" vote to chedked
                    defaultChecked={vote.type === 2}
                  />
                  <label htmlFor={proposal.proposalId + "-" + vote.type}>
                    {vote.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
        <button disabled={isVoting || hasVoted} type="submit">
          {isVoting
            ? "Voting..."
            : hasVoted
            ? "You Already Voted"
            : "Submit Votes"}
        </button>
        <small>
          This will trigger multiple transactions that you will need to sign.
        </small>
      </form>
    </div>
  );
};
