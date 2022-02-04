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
    await tokenModule.grantRole("minter", voteModule.address);
    console.log(
      "Successfully gave vote module permissions to act on token module"
    );
  } catch (error) {
    console.error(
      "failed to grant vote module permissions on token module",
      error
    );
    process.exit(1);
  }

  try {
    const ownedTokenBalance = await tokenModule.balanceOf(
      REACT_APP_WALLET_ADDRESS
    );

    const ownedAmount = ethers.BigNumber.from(ownedTokenBalance.value);
    const percent90 = ownedAmount.div(100).mul(90);

    await tokenModule.transfer(voteModule.address, percent90);
    console.log("✅ Successfully transferred tokens to vote module");
  } catch (error) {
    console.error("failed to transfer tokens to vote module", error);
  }
})();
