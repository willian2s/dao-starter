import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";
import { UnsupportedChainIdError } from "@web3-react/core";
import { useEffect, useState } from "react";
import { MemberList } from "./components/MemberList";
import { VoteForm } from "./components/VoteForm";

const {
  REACT_APP_BUNDLE_DROP_ADDRESS,
  REACT_APP_TOKEN_ADDRESS,
  REACT_APP_NETWORK,
  REACT_APP_VOTE_ADDRESS,
} = process.env;

const sdk = new ThirdwebSDK(REACT_APP_NETWORK);
const bundleDropModule = sdk.getBundleDropModule(REACT_APP_BUNDLE_DROP_ADDRESS);
const tokenModule = sdk.getTokenModule(REACT_APP_TOKEN_ADDRESS);
const voteModule = sdk.getVoteModule(REACT_APP_VOTE_ADDRESS);

const App = () => {
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("🚀 ~ address", address);

  const signer = provider ? provider.getSigner() : undefined;

  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [memberTokenAmounts, setMemberTokenAmounts] = useState({});
  const [memberAddresses, setMemberAddresses] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);

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

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    (async () => {
      try {
        const proposals = await voteModule.getAll();
        setProposals(proposals);
        console.log("🌈 Proposals: ", proposals);
      } catch (error) {
        console.error("failed to get proposals", error);
      }
    })();
  }, [hasClaimedNFT]);

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    if (!proposals.length) {
      return;
    }

    (async () => {
      try {
        const hasVoted = await voteModule.hasVoted(
          proposals[0].proposalId,
          address
        );
        setHasVoted(hasVoted);
        if (hasVoted) {
          console.log("🥵 User has already voted");
        } else {
          console.log("🙂 User has not voted yet");
        }
      } catch (error) {
        console.error("failed to check if wallet has voted", error);
      }
    })();
  }, [hasClaimedNFT, proposals, address]);

  if (error instanceof UnsupportedChainIdError) {
    return (
      <div className="unsupported-network">
        <h2>Please connect to Rinkeby</h2>
        <p>
          This dapp only works on the Rinkeby network, please switch networks in
          your connected wallet.
        </p>
      </div>
    );
  }

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
        <div>
          <MemberList
            memberAddresses={memberAddresses}
            memberTokenAmounts={memberTokenAmounts}
          />
          <VoteForm
            hasVoted={hasVoted}
            setHasVoted={setHasVoted}
            address={address}
            proposals={proposals}
          />
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
