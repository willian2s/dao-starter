import { readFileSync } from "fs";
import sdk from "./1-initialize-sdk.js";

import dotenv from "dotenv";
dotenv.config();

const { REACT_APP_BUNDLE_DROP_ADDRESS } = process.env;
const bundleDrop = sdk.getBundleDropModule(REACT_APP_BUNDLE_DROP_ADDRESS);

(async () => {
  try {
    await bundleDrop.createBatch([
      {
        name: "Three Rubik Cube",
        description: "Chain of cube",
        image: readFileSync("scripts/assets/rubiks-cube.png"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})();
