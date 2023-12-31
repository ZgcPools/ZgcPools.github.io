import {
  ThirdwebProvider,
  ConnectWallet,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  darkTheme,
} from "@thirdweb-dev/react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";

import { Avatar, AvatarBadge, AvatarGroup } from "@chakra-ui/react";
import Navbar from "../component/navbar";
import Footer from "../component/footer";

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
import { stakingContractAddress } from "../const/yourDetails";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@chakra-ui/react";

export default function farming() {
  const address = useAddress();
  const [amountToStake, setAmountToStake] = useState(0);
  const [amountToWithdraw, setAmountToWithdraw] = useState(0);

  // Initialize all the contracts
  const { contract: staking, isLoading: isStakingLoading } = useContract(
    stakingContractAddress,
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
    <div className={styles.container}>
      {/* NAV */}
      <div className={styles.connect}>
        <div className={styles.burger}>
          <Menu>
            <MenuButton
              className={styles.breada}
              as={Button}
              rightIcon={<HamburgerIcon />}
            ></MenuButton>
            <MenuList className={styles.bread}>
              <MenuItem className={styles.bread}>
                {" "}
                <Link href="/https://zerogic.github.io/">Home</Link>
              </MenuItem>
              <MenuItem className={styles.bread}>
                <Link href="/Swap">Swap</Link>
              </MenuItem>
              <MenuItem className={styles.bread}>
                <Link href="/farming">Farms</Link>
              </MenuItem>
              <MenuItem className={styles.bread}>
                <Link href="/">Vault</Link>
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
        <div>
          <Breadcrumb className={styles.breadt} separator="-">
            <BreadcrumbItem>
              <BreadcrumbLink
                className={styles.bread}
                href="/https://zerogic.github.io/"
              >
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink className={styles.bread} href="/Swap">
                Swap
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink className={styles.bread} href="/farming">
                Farms
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink className={styles.bread} href="/">
                Vault
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
        <div>
          <ConnectWallet
            theme={darkTheme({
              colors: {
                secondaryButtonBg: "#5e0000",
                connectedButtonBg: "#5e0000",
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
      </div>
      {/* NAV */}
      <div className={styles.card}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.ts}>Farms</h1>
            <h6>Just Stake Lp Tokens To Earn,High APR, Low Risk.</h6>
          </div>
          <div className={styles.gambardua}>
            <img src="/wew.png" width={200} className={styles.down} />
          </div>
        </div>
      </div>
      {/* MENU */}
      {/* tombol c */}
      <div className={styles.atas}>
        <div className={styles.chek}>
          <Avatar
            className={styles.lingkarandua}
            width={35}
            name="Zerogic"
            src="/zgc.png"
          />
          <Avatar
            className={styles.lingkarandua}
            width={35}
            name="Zerogic"
            src="/poly.png"
          />
          <Avatar
            className={styles.lingkarandua}
            width={35}
            name="Zerogic"
            src="/quic.png"
          />
          <Avatar
            className={styles.lingkarandua}
            width={35}
            name="Zerogic"
            src="/ankr.png"
          />
          <Avatar
            className={styles.lingkarandua}
            width={35}
            name="Zerogic"
            src="/catt.png"
          />
          <Avatar
            className={styles.lingkarandua}
            width={35}
            name="Zerogic"
            src="/etr.png"
          />
        </div>
      </div>
      <div className={styles.accor}>
        <div className={styles.menu2}>
          <Accordion allowMultiple>
            <Navbar />
          </Accordion>
        </div>
      </div>
      {/* staking */}
      <Footer />
      <div className={styles.copyy}>
        <p class="copyright">
          &copy; 2023 Zerogic All Rights Reserved by
          <a href="" className={styles.copyright}>
            Zerogic
          </a>
        </p>
      </div>
    </div>
  );
}
