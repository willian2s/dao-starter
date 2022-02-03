import sdk from "./1-initialize-sdk.js";

import dotenv from "dotenv";
dotenv.config();

const { REACT_APP_BUNDLE_DROP_ADDRESS } = process.env;
const bundleDrop = sdk.getBundleDropModule(REACT_APP_BUNDLE_DROP_ADDRESS);

(async () => {
  try {
    const claimConditionFactory = bundleDrop.getClaimConditionFactory();

    claimConditionFactory.newClaimPhase({
      startTime: new Date(),
      maxQuantity: 50_000,
      maxQuantityPerTransaction: 1,
    });

    await bundleDrop.setClaimCondition(0, claimConditionFactory);
    console.log(
      `✅ Successfully set claim condition on bundle drop: ${bundleDrop.address}`
    );
  } catch (error) {
    console.error("Failed to set claim condition", error);
  }
})();
