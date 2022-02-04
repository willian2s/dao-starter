import { ethers } from "ethers";
import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";
import { useEffect, useMemo, useState } from "react";

const {
  REACT_APP_BUNDLE_DROP_ADDRESS,
  REACT_APP_TOKEN_ADDRESS,
  REACT_APP_NETWORK,
} = process.env;

const sdk = new ThirdwebSDK(REACT_APP_NETWORK);
const bundleDropModule = sdk.getBundleDropModule(REACT_APP_BUNDLE_DROP_ADDRESS);
const tokenModule = sdk.getTokenModule(REACT_APP_TOKEN_ADDRESS);

const App = () => {
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("🚀 ~ address", address);

  const signer = provider ? provider.getSigner() : undefined;

  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [memberTokenAmounts, setMemberTokenAmounts] = useState({});
  const [memberAddresses, setMemberAddresses] = useState([]);

  const shortenAddress = (str) => {
    return `${str.substring(0, 6)}...${str.substring(str.length - 4)}`;
  };

  const mintNFT = async () => {
    setIsClaiming(true);
    try {
      await bundleDropModule.claim("0", 1);
      setHasClaimedNFT(true);
      console.log(
        `🌊 Successfully Minted! Check it our on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address.toLowerCase()}/0`
      );
    } catch (error) {
      console.error("failed to claim", error);
    } finally {
      setIsClaiming(false);
    }
  };

  useEffect(() => {
    sdk.setProviderOrSigner(signer);
  }, [signer]);

  useEffect(() => {
    if (!address) {
      return;
    }

    (async () => {
      try {
        const balance = await bundleDropModule.balanceOf(address, "0");
        if (balance.gte(0)) {
          setHasClaimedNFT(true);
          console.log("🌟 this user has a membership NFT!");
        } else {
          setHasClaimedNFT(false);
          console.log("😭 this user doesn't have a membership NFT.");
        }
      } catch (error) {
        setHasClaimedNFT(false);
        console.error("failed to nft balance", error);
      }
    })();
  }, [address]);

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    (async () => {
      try {
        const memberAddresses = await bundleDropModule.getAllClaimerAddresses(
          "0"
        );
        console.log(`🚀 Members addresses: ${memberAddresses}`);
        setMemberAddresses(memberAddresses);
      } catch (error) {
        console.error("failed to get member list", error);
      }
    })();
  }, [hasClaimedNFT]);

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    (async () => {
      try {
        const memberTokenAmounts = await tokenModule.getAllHolderBalances();
        console.log("👜 Amounts: ", memberTokenAmounts);
        setMemberTokenAmounts(memberTokenAmounts);
      } catch (error) {
        console.error("failed to get token amounts", error);
      }
    })();
  }, [hasClaimedNFT]);

  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      return {
        address,
        tokenAmount: ethers.utils.formatUnits(
          memberTokenAmounts[address] || 0,
          18
        ),
      };
    });
  }, [memberAddresses, memberTokenAmounts]);

  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to Starter</h1>
        <button onClick={() => connectWallet("injected")} className="btn-hero">
          Connect your wallet
        </button>
      </div>
    );
  }

  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>Starter Member Page</h1>
        <p>Congratulations on being a member</p>
        <div>
          <div>
            <h2>Member List</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Token Amount</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mint-nft">
      <h1>Mint your free Starter Membership NFT</h1>
      <button disabled={isClaiming} onClick={() => mintNFT()}>
        {isClaiming ? "Minting..." : "Mint your nft (FREE)"}
      </button>
    </div>
  );
};

export default App;
