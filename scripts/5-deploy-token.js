import sdk from "./1-initialize-sdk.js";

import dotenv from "dotenv";
dotenv.config();

const { REACT_APP_ADDRESS_APP } = process.env;
const app = sdk.getAppModule(REACT_APP_ADDRESS_APP);

(async () => {
  try {
    const tokenModule = await app.deployTokenModule({
      name: "Starter Governance Token",
      symbol: "STT",
      description: "This is the governance token developed for DAO Starter",
    });
    console.log(
      `✅ Successfully deployed token module, address: ${tokenModule.address}`
    );
  } catch (error) {
    console.error("failed to deploy token module", error);
  }
})();
