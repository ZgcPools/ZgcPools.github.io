import {
  ThirdwebProvider,
  ConnectWallet,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  darkTheme,
} from "@thirdweb-dev/react";

import {
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
  useTokenBalance,
  Web3Button,
} from "@thirdweb-dev/react";
import { Image } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { stakingContractAddressLp } from "../const/Lpcontract";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";

export default function farming() {
  const address = useAddress();
  const [amountToStake, setAmountToStake] = useState(0);
  const [amountToWithdraw, setAmountToWithdraw] = useState(0);

  // Initialize all the contracts
  const { contract: staking, isLoading: isStakingLoading } = useContract(
    stakingContractAddressLp,
    "custom"
  );

  // Get contract data from staking contract
  const { data: rewardTokenAddress } = useContractRead(staking, "rewardToken");
  const { data: stakingTokenAddress } = useContractRead(
    staking,
    "stakingToken"
  );

  // Initialize token contracts
  const { contract: stakingToken, isLoading: isStakingTokenLoading } =
    useContract(stakingTokenAddress, "token");
  const { contract: rewardToken, isLoading: isRewardTokenLoading } =
    useContract(rewardTokenAddress, "token");

  // Token balances
  const { data: stakingTokenBalance, refetch: refetchStakingTokenBalance } =
    useTokenBalance(stakingToken, address);
  const { data: rewardTokenBalance, refetch: refetchRewardTokenBalance } =
    useTokenBalance(rewardToken, address);

  // Get staking data
  const {
    data: stakeInfo,
    refetch: refetchStakingInfo,
    isLoading: isStakeInfoLoading,
  } = useContractRead(staking, "getStakeInfo", [address || "0"]);

  useEffect(() => {
    setInterval(() => {
      refetchData();
    }, 10000);
  }, []);

  const refetchData = () => {
    refetchRewardTokenBalance();
    refetchStakingTokenBalance();
    refetchStakingInfo();
  };

  return (
    <div className={styles.container}>
      <div className={styles.connect}>
        <ConnectWallet
          theme={darkTheme({
            colors: {
              secondaryButtonBg: "#9e0000",
              connectedButtonBg: "#9e0000",
            },
          })}
          switchToActiveChain={true}
          modalSize={"compact"}
          welcomeScreen={{
            img: {
              src: "ipfs://QmSJFXUAMSf1GLtdSM7WyRcx58SzqpoQgN4hZLT8i3uRXJ/zgc-modified.png",
              width: 150,
              height: 150,
            },
            title: "Welcome to zerogic staking",
          }}
          modalTitleIconUrl={
            "ipfs://QmSJFXUAMSf1GLtdSM7WyRcx58SzqpoQgN4hZLT8i3uRXJ/zgc-modified.png"
          }
        />
      </div>

      <main className={styles.main}>
        <img src="/zgc.png" width={300} className={styles.down} />
        <h2 className={styles.description}>
          Farming Zerogic <span className={styles.span}> Earn Idrc!</span>
        </h2>
        <p className={styles.paragraf}>
          Earn passive income with zerogic staking{" "}
          <span className={styles.span}> and earn rupiah-c tokens!</span>
        </p>
        <img src="/wew.png" width={200} className={styles.drs} />
        <Accordion defaultIndex={[0]} allowMultiple className={styles.apa}>
          <AccordionItem>
            <h2>
              <AccordionButton
                className={styles.footer}
                _expanded={{ bg: "rgba(5, 163, 0, 0.574)", color: "white" }}
              >
                <Image
                  borderRadius="full"
                  boxSize="80px"
                  src="./farms.png"
                  alt="ZGC-MATIC"
                />

                <h3>Stake LP tokens </h3>

                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <div className={styles.grid}>
                <a className={styles.cardw}>
                  <div className={styles.judul}>
                    <p>Zgc-Lp Balance:</p>
                    <p>{stakingTokenBalance?.displayValue}</p>
                  </div>
                  <input
                    className={styles.textbox}
                    type="number"
                    value={amountToStake}
                    onChange={(e) => setAmountToStake(e.target.value)}
                  />
                  <Web3Button
                    className={styles.button}
                    contractAddress={stakingContractAddressLp}
                    action={async (contract) => {
                      await stakingToken.setAllowance(
                        stakingContractAddressLp,
                        amountToStake
                      );
                      await contract.call("stake", [
                        ethers.utils.parseEther(amountToStake),
                      ]);
                      alert("Tokens staked successfully!");
                    }}
                  >
                    Stake
                  </Web3Button>
                  <div className={styles.judul}>
                    <p>Current staked:</p>
                    <p>
                      {stakeInfo &&
                        ethers.utils.formatEther(stakeInfo[0].toString())}
                    </p>
                  </div>
                  <input
                    className={styles.textbox}
                    type="number"
                    value={amountToWithdraw}
                    onChange={(e) => setAmountToWithdraw(e.target.value)}
                  />
                  <Web3Button
                    className={styles.button}
                    contractAddress={stakingContractAddressLp}
                    action={async (contract) => {
                      await contract.call("withdraw", [
                        ethers.utils.parseEther(amountToWithdraw),
                      ]);
                      alert("Tokens unstaked successfully!");
                    }}
                  >
                    Unstake
                  </Web3Button>
                </a>

                <a className={styles.cardw}>
                  <div className={styles.rew}>
                    <img src="./idrc.png" width={100} />
                    <h4>
                      {stakeInfo &&
                        ethers.utils.formatEther(stakeInfo[1].toString())}
                    </h4>
                  </div>
                  <Web3Button
                    color="red"
                    className={styles.button}
                    contractAddress={stakingContractAddressLp}
                    action={async (contract) => {
                      await contract.call("claimRewards", []);
                      alert("Rewards claimed successfully!");
                    }}
                  >
                    Harvest
                  </Web3Button>
                  <div className={styles.rew}>
                    <p>Idrc Balance:</p>
                    <p>{rewardTokenBalance?.displayValue}</p>
                  </div>
                </a>

                <a
                  className={styles.tetxx}
                  color="rgba(5, 163, 0, 0.574)"
                  href="https://plaxswap.io/add/MATIC/0x4A7db095D7D56De8af219a5aE9C0b3Be11F240F5"
                >
                  + Get Lp Tokens
                </a>
                <img
                  src="./stonew.png"
                  width={240}
                  className={styles.lingkaran}
                />
              </div>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </main>
      <main className={styles.maini}>
        <a
          className={styles.buy}
          href="https://plaxswap.io/swap?inputCurrency=Matic&outputCurrency=0x4A7db095D7D56De8af219a5aE9C0b3Be11F240F5"
        >
          $ Buy Zerogic (ZGC)
        </a>
        <a className={styles.buy} href="/">
          Pools
        </a>
      </main>
    </div>
  );
}