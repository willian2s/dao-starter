import sdk from "./1-initialize-sdk.js";

import dotenv from "dotenv";
dotenv.config();

const { REACT_APP_ADDRESS_APP, REACT_APP_TOKEN_ADDRESS } = process.env;
const appModule = sdk.getAppModule(REACT_APP_ADDRESS_APP);

(async () => {
  try {
    const voteModule = await appModule.deployVoteModule({
      name: "StartersDAO's Proposals",
      votingTokenAddress: REACT_APP_TOKEN_ADDRESS,
      proposalStartWaitTimeInSeconds: 0,
      proposalVotingTimeInSeconds: 168 * 60 * 60,
      votingQuorumFraction: 0,
      minimumNumberOfTokensNeededToPropose: "0",
    });

    console.log(
      `✅ Successfully deployed vote module, address: ${voteModule.address}`
    );
  } catch (error) {
    console.error("Failed to deploy vote module", error);
  }
})();
