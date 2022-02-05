import sdk from "./1-initialize-sdk.js";
import dotenv from "dotenv";
dotenv.config();

const { REACT_APP_TOKEN_ADDRESS, REACT_APP_WALLET_ADDRESS } = process.env;
const tokenModule = sdk.getTokenModule(REACT_APP_TOKEN_ADDRESS);

(async () => {
  try {
    console.log(
      "👀 Roles that exist right now:",
      await tokenModule.getAllRoleMembers()
    );

    await tokenModule.revokeAllRolesFromAddress(REACT_APP_WALLET_ADDRESS);
    console.log(
      "🎉 Roles after revoking ourselves",
      await tokenModule.getAllRoleMembers()
    );
    console.log(
      "✅ Successfully revoked our superpowers from the ERC-20 contract"
    );
  } catch (error) {
    console.error("Failed to revoke ourselves from the DAO treasury", error);
  }
})();
