import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";
import dotenv from "dotenv";
dotenv.config();

const {
  REACT_APP_VOTE_ADDRESS,
  REACT_APP_TOKEN_ADDRESS,
  REACT_APP_WALLET_ADDRESS,
} = process.env;
const voteModule = sdk.getVoteModule(REACT_APP_VOTE_ADDRESS);
const tokenModule = sdk.getTokenModule(REACT_APP_TOKEN_ADDRESS);

(async () => {
  try {
    const amount = 420_000;
    await voteModule.propose(
      `Should the DAO mint an additional ${amount} tokens into the treasury?`,
      [
        {
          nativeTokenValue: 0,
          transactionData: tokenModule.contract.interface.encodeFunctionData(
            "mint",
            [voteModule.address, ethers.utils.parseUnits(amount.toString(), 18)]
          ),
          toAddress: tokenModule.address,
        },
      ]
    );

    console.log("✅ Successfully created proposal to mint tokens");
  } catch (error) {
    console.error("failed to create first proposal", error);
    process.exit(1);
  }

  try {
    const amount = 6_900;
    await voteModule.propose(
      `Should the DAO transfer ${amount} tokens from the treasury to ${REACT_APP_WALLET_ADDRESS} for being awesome?`,
      [
        {
          nativeTokenValue: 0,
          transactionData: tokenModule.contract.interface.encodeFunctionData(
            "transfer",
            [
              REACT_APP_WALLET_ADDRESS,
              ethers.utils.parseUnits(amount.toString(), 18),
            ]
          ),

          toAddress: tokenModule.address,
        },
      ]
    );

    console.log(
      "✅ Successfully created proposal to reward ourselves from the treasury, let's hope people vote for it!"
    );
  } catch (error) {
    console.error("failed to create second proposal", error);
  }
})();
