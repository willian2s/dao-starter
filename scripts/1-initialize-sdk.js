import { ThirdwebSDK } from "@3rdweb/sdk";
import { ethers } from "ethers";

import dotenv from "dotenv";
dotenv.config();

const {
  REACT_APP_PRIVATE_KEY,
  REACT_APP_WALLET_ADDRESS,
  REACT_APP_ALCHEMY_API_URL,
} = process.env;

if (!REACT_APP_PRIVATE_KEY || REACT_APP_PRIVATE_KEY === "") {
  console.log("🛑 Private key not found.");
}

if (!REACT_APP_ALCHEMY_API_URL || REACT_APP_ALCHEMY_API_URL === "") {
  console.log("🛑 Alchemy API URL not found.");
}

if (!REACT_APP_WALLET_ADDRESS || REACT_APP_WALLET_ADDRESS === "") {
  console.log("🛑 Wallet Address not found.");
}

const sdk = new ThirdwebSDK(
  new ethers.Wallet(
    REACT_APP_PRIVATE_KEY,
    ethers.getDefaultProvider(REACT_APP_ALCHEMY_API_URL)
  )
);

(async () => {
  try {
    const apps = await sdk.getApps();
    console.log(`Your app address is:  ${apps[0].address}`);
  } catch (error) {
    console.error("Failed to get apps from the sdk", error);
    process.exit(1);
  }
})();

export default sdk;
