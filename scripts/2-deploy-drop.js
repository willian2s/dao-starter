import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

import dotenv from "dotenv";
dotenv.config();

const { REACT_APP_ADDRESS_APP } = process.env;

const app = sdk.getAppModule(REACT_APP_ADDRESS_APP);

(async () => {
  try {
    const bundleDropModule = await app.deployBundleDropModule({
      name: "Starter Membership",
      description: "A DAO for beginners in Web3",
      image: readFileSync("scripts/assets/rubiks-cube.jpeg"),
      primarySaleRecipientAddress: ethers.constants.AddressZero,
    });

    console.log(
      `✅ Successfully deployed bundleDrop module, address: ${bundleDropModule.address}`
    );
    console.log(
      "✅ bundleDrop metadata:",
      await bundleDropModule.getMetadata()
    );
  } catch (error) {
    console.log("failed to deploy bundleDrop module", error);
  }
})();
