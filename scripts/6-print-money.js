import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

const { REACT_APP_TOKEN_ADDRESS } = process.env;
const tokenModule = sdk.getTokenModule(REACT_APP_TOKEN_ADDRESS);

(async () => {
  try {
    const amount = 1_000_000;
    const amountWith18decimals = ethers.utils.parseUnits(amount.toString(), 18);
    await tokenModule.mint(amountWith18decimals);
    const totalSupply = await tokenModule.totalSupply();

    console.log(
      `✅ There now is ${ethers.utils.formatUnits(
        totalSupply,
        18
      )}$STR in circulation`
    );
  } catch (error) {
    console.error("Failed to print money", error);
  }
})();
