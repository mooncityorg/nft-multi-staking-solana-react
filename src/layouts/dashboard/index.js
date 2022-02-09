import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { toast, ToastContainer } from 'react-toastify';
import { useWallet } from '@solana/wallet-adapter-react';
import { bcbyValidate, claimReward, getGlobalState, getUserBarnState, solConnection, stakeToYard, withdrawFromYard } from '../../contexts/helpers';
import { getReward } from '../../contexts/utils';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { ANIMAL_MAX, FARMER_MAX, LAND_MAX } from '../../config';
import { errorAlert } from '../../components/toastGroup';
import Header from '../../components/Header';

export default function DashboardLayout({ children, ...props }) {

  const wallet = useWallet();
  const [openSidebar, setOpenSidebar] = useState(true);
  const [userBarnState, setUserBarnState] = useState({ yardCount: 0, stakedNFTCount: 0, yards: [], lastRewardTime: 0, remainingRewardAmount: 0 });
  // const [globalState, setGlobalState] = useState({ yardCount: 0, stakedNFTCount: 0 });
  const [userRewardInfo, setUserRewardInfo] = useState({ lastRewardTime: 0, availableRewardAmount: 0 });
  const [claimLoading, setClaimLoading] = useState(false);

  const [landNfts, setLandNfts] = useState([]);
  const [farmerNfts, setFarmerNfts] = useState([]);
  const [animalNfts, setAnimalNfts] = useState([]);

  const [landSelected, setLandSelected] = useState([]);
  const [farmerSelected, setFarmerSelected] = useState([]);
  const [animalSelected, setAnimalSelected] = useState([]);

  const [hide, setHide] = useState(false);

  const [stakeDisable, setStakeDisable] = useState(true);
  const [stakeLoading, setStakeLoading] = useState(false);
  const [allUncheck, setAllUncheck] = useState(false);
  const [unstakeLoading, setUnstakeLoading] = useState(false);

  const getMetadataDetail = async () => {
    const nftsList = await getParsedNftAccountsByOwner({ publicAddress: wallet.publicKey, connection: solConnection });
    return nftsList;
  }

  const onStakeToYard = () => {
    try {
      setStakeLoading(true);
      stakeToYard(wallet, landSelected[0], animalSelected, farmerSelected).then(() => {
        updateStakedYardState(wallet.publicKey)
        spleteNFTs();
        setSelectedEmpty();
        setAllUncheck(true);
        setStakeLoading(false);
      });
    } catch (error) {
      setStakeLoading(false);
    }

  }

  const spleteNFTs = async () => {
    const nfts = await getMetadataDetail();
    let lands = [];
    let farmers = [];
    let animals = [];
    nfts.forEach(nft => {
      const kind = bcbyValidate(nft.data.creators[0].address);
      if (kind === 1) {
        lands.push(nft)
      } else if (kind === 2) {
        farmers.push(nft)
      } else if (kind === 3) {
        animals.push(nft)
      }
    });
    setLandNfts(lands);
    setFarmerNfts(farmers)
    setAnimalNfts(animals);
  }

  const selectNFTs = (collection, mint, checked) => {
    let dumpArray = [];
    if (collection === 1) {
      dumpArray = landSelected;
      if (checked) {
        dumpArray.push(mint);
        setLandSelected(dumpArray);
        if (dumpArray.length > LAND_MAX) {
          errorAlert(`You can select up to ${LAND_MAX} Land NFTs.`);
        } else { toast.dismiss() }
      } else {
        removeItem(dumpArray, mint)
      }
    } else if (collection === 2) {
      dumpArray = farmerSelected;
      if (checked) {
        dumpArray.push(mint);
        setFarmerSelected(dumpArray);
        if (dumpArray.length > FARMER_MAX) {
          errorAlert(`You can select up to ${FARMER_MAX} Farmer NFTs.`);
        } else { toast.dismiss() }
      } else {
        removeItem(dumpArray, mint)
      }
    } else {
      dumpArray = animalSelected;
      if (checked) {
        dumpArray.push(mint);
        setAnimalSelected(dumpArray);
        if (dumpArray.length > ANIMAL_MAX) {
          errorAlert(`You can select up to ${ANIMAL_MAX} Animal NFTs.`);
        } else { toast.dismiss() }
      } else {
        removeItem(dumpArray, mint)
      }
    }
    setHide(!hide)
  }

  const removeItem = (array, mint) => {
    const index = array.indexOf(mint);
    if (index > -1) {
      array.splice(index, 1);
    }
  }


  const onRefreshRewards = () => {
    setInterval(() => {
      let rewardTime = userBarnState.lastRewardTime;
      let totalReward = userBarnState.remainingRewardAmount;
      for (let i = 0; i < userBarnState.yardCount; i++) {
        let lastRewardTime = rewardTime;
        if (lastRewardTime < userBarnState.yards[i].stakedTime) lastRewardTime = userBarnState.yards[i].stakedTime;
        const count = 1 + userBarnState.yards[i].animMints.length + userBarnState.yards[i].farmerMints.length;
        let reward = getReward(lastRewardTime) * count;
        totalReward += reward;
        setHide(!hide); //re-render
      }
      setUserRewardInfo({
        lastRewardTime: rewardTime,
        availableRewardAmount: totalReward / LAMPORTS_PER_SOL,
      })
      setHide(!hide); //re-render
    }, 2000);
  }

  const onWithdrawFromYard = (landMint, animMints, farmerMints) => {
    withdrawFromYard(wallet, landMint, animMints, farmerMints, (e) => setUnstakeLoading(e)).then(() => {
      updateStakedYardState(wallet.publicKey)
      spleteNFTs()
    });
    setHide(!hide); //re-render
  }

  const onClaimReward = () => {
    clearIntervals();
    claimReward(wallet, (e) => setClaimLoading(e), clearIntervals).then(() => {
      onRefreshRewards();
      setHide(!hide); //re-render
    })
  }

  const updateStakedYardState = (addr) => {
    getUserBarnState(addr).then(result => {
      if (result !== null) {
        let barnState = {};
        barnState.yardCount = result.yardCount.toNumber();
        barnState.stakedNFTCount = result.stakedNftCount.toNumber();
        barnState.yards = [];
        for (let i = 0; i < result.yardCount; i++) {
          let yard = {};
          yard.landMint = result.yards[i].landMint.toBase58();
          yard.animMints = result.yards[i].animMints.slice(0, result.yards[i].animCnt).map((mint) => mint.toBase58());
          yard.farmerMints = result.yards[i].farmerMints.slice(0, result.yards[i].farmerCnt).map((mint) => mint.toBase58());
          yard.stakedTime = result.yards[i].stakeTime.toNumber();
          barnState.yards.push(yard);
        }
        barnState.lastRewardTime = result.rewardTime.toNumber();
        barnState.remainingRewardAmount = result.remainRewardAmount.toNumber();
        setUserBarnState(barnState);
        setHide(!hide); //re-render
      }
    })
    getGlobalState().then(result => {
      if (!result) return;
      // setGlobalState({
      //   yardCount: result.landStakedCnt.toNumber(),
      //   stakedNFTCount: result.landStakedCnt.toNumber()
      //     + result.animStakedCnt.toNumber()
      //     + result.farmerStakedCnt.toNumber(),
      // })
    })
  }

  const clearIntervals = () => {
    for (let i = 0; i < 2000; i++) {
      clearInterval(i)
    }
  }

  useEffect(() => {
    if (
      landSelected.length === 1 &&
      (farmerSelected.length > 0 && farmerSelected.length <= FARMER_MAX) &&
      (animalSelected.length > 0 && animalSelected.length <= ANIMAL_MAX)
    ) {
      setStakeDisable(false)
    } else {
      setStakeDisable(true)
    }
    // eslint-disable-next-line
  }, [landSelected.length, farmerSelected.length, animalSelected.length])

  const setEmpty = () => {
    setLandNfts([]);
    setFarmerNfts([]);
    setAnimalNfts([]);
    setHide(!hide)
  }

  const setSelectedEmpty = () => {
    setLandSelected([]);
    setAnimalSelected([]);
    setFarmerSelected([]);
    setHide(!hide)
  }

  useEffect(() => {
    if (wallet.publicKey === null) {
      setEmpty()
    } else {
      clearIntervals()
      onRefreshRewards();
    }
    // eslint-disable-next-line
  }, [userBarnState]);

  useEffect(() => {
    if (wallet.publicKey === null) {
      setEmpty()
    } else {
      spleteNFTs();
      updateStakedYardState(wallet.publicKey);
      clearIntervals()
      onRefreshRewards()
    }
    setHide(!hide)
    // eslint-disable-next-line
  }, [wallet])

  return (
    <>
      <Header />
      <Sidebar
        rewardValue={userRewardInfo.availableRewardAmount}
        onClaimReward={onClaimReward}
        claimLoading={claimLoading}
        openSidebar={openSidebar}
        setOpenSidebar={setOpenSidebar}
      />
      {React.cloneElement(children, {
        yards: userBarnState,
        onWithdrawFromYard: onWithdrawFromYard,
        spleteNFTs: spleteNFTs,
        selectNFTs: selectNFTs,
        removeItem: removeItem,
        landNfts: landNfts,
        farmerNfts: farmerNfts,
        animalNfts: animalNfts,
        stakeDisable: stakeDisable,
        stakeLoading: stakeLoading,
        landSelected: landSelected,
        farmerSelected: farmerSelected,
        animalSelected: animalSelected,
        allUncheck: allUncheck,
        onStakeToYard: onStakeToYard,
        unstakeLoading: unstakeLoading,
      })}
      <ToastContainer
        autoClose={5000}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
