import { Box } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import {
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
  useTokenBalance,
  Web3Button,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { stakingContractAddressLp } from "../const/DAI";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";

export default function DAI() {
  const address = useAddress();
  const [amountToStake, setAmountToStake] = useState(0);
  const [amountToWithdraw, setAmountToWithdraw] = useState(0);

  // Initialize all the contracts
  const { contract: staking, isLoading: isStakingLoading } = useContract(
    stakingContractAddressLp,
    "custom"
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
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
    <AccordionItem>
      <h2>
        <AccordionButton className={styles.menu}>
          <Box className={styles.box} as="span" flex="1" textAlign="left">
            <div className={styles.boxx}>
              <img src="/Dai.png" width={45} />
              <h3 className={styles.padian}>
                Earn Dai <span className={styles.padi}>Stake Zgc</span>
              </h3>
            </div>
            <h4>APR 12%</h4>
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        <div className={styles.now}>
          <h4>
            <span className={styles.ap}>Dai</span> Earned
          </h4>
          <div className={styles.reward}>
            <h4 className={styles.now}>
              {stakeInfo && ethers.utils.formatEther(stakeInfo[1].toString())}
            </h4>
            <div className={styles.but}>
              <Web3Button
                contractAddress={stakingContractAddressLp}
                action={async (contract) => {
                  await contract.call("claimRewards", []);
                  alert("Rewards claimed successfully!");
                }}
              >
                Harvest
              </Web3Button>
            </div>
          </div>
        </div>
        <div className={styles.now}>
          <div>
            <h4>
              <span className={styles.ap}>Zgc</span> Staked
            </h4>
          </div>
          <div className={styles.reward}>
            <h4 className={styles.now}>
              {stakeInfo && ethers.utils.formatEther(stakeInfo[0].toString())}
            </h4>
            <div className={styles.but}>
              <div>
                <Button className={styles.button} onClick={onOpen}>
                  Stake
                </Button>
                <Modal
                  className={styles.up}
                  closeOnOverlayClick={false}
                  isOpen={isOpen}
                  onClose={onClose}
                >
                  <ModalOverlay />
                  <ModalContent className={styles.modal}>
                    <ModalHeader>
                      <h2>Your Wallet</h2>
                    </ModalHeader>

                    <ModalBody p={10}>
                      <div className={styles.judul}>
                        <p>Dai Balance:</p>
                        <p>{rewardTokenBalance?.displayValue}</p>
                      </div>
                      <div className={styles.judul}>
                        <p>Zgc Balance:</p>
                        <p>{stakingTokenBalance?.displayValue}</p>
                      </div>
                    </ModalBody>
                    <div className={styles.close}>
                      <input
                        className={styles.textbox}
                        type="number"
                        value={amountToStake}
                        onChange={(e) => setAmountToStake(e.target.value)}
                      />
                      <input
                        className={styles.textbox}
                        type="number"
                        value={amountToWithdraw}
                        onChange={(e) => setAmountToWithdraw(e.target.value)}
                      />
                    </div>
                    <ModalFooter>
                      <Web3Button
                        className={styles.clos}
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
                      <Web3Button
                        className={styles.clos}
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
                    </ModalFooter>
                    <ModalCloseButton className={styles.closb} />
                  </ModalContent>
                </Modal>
                <div />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.bung}>
          <div className={styles.foot}>
            <h4>APR:</h4>
            <h4>12%</h4>
          </div>
          <div className={styles.foot}></div>
          <div className={styles.foot}>
            <h4>Ends in:</h4>
            <div className={styles.ass}>
              <a className={styles.ap} href="">
                Finished
              </a>
              <a className={styles.ap} href="">
                Get Zgc Token
              </a>
              <a className={styles.ap} href="/farming">
                View Contract
              </a>
            </div>
          </div>
        </div>
      </AccordionPanel>
    </AccordionItem>
  );
}
