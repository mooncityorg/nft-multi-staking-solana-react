import { useState, useEffect } from "react";
import { Collapse } from "@material-ui/core";
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import StakedNFTCard from "./StakedNFTCard";
import LoadingPage from "./LoadingPage";

export default function YardItem({
  yard,
  onWithdrawFromYard,
  unstakeLoading,
  number,
  stakedTime,
  ...props }) {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState("");
  const handleUnstake = () => {
    onWithdrawFromYard(yard.landMint, yard.animMints, yard.farmerMints)
  }
  useEffect(() => {
    const date = new Date(stakedTime * 1000)
    const dateString = date.getUTCFullYear() + "/" + (date.getUTCMonth() + 1) + "/" + date.getUTCDate() + " " + date.getUTCHours() + ":" + date.getUTCMinutes();
    setTime(dateString)
  }, [stakedTime])
  return (
    <div className="yard-item">
      <div className="yard-titlebar" onClick={() => setOpen(!open)}>
        <div className="yard-name">
          Barnyard #{number} <span>{time}</span>
        </div>
        <div className="yard-nfts">
          <div className="yard-count">
            land: <span>1</span>
          </div>
          <div className="yard-count">
            farmer: <span>{yard.farmerMints.length}</span>
          </div>
          <div className="yard-count">
            animal: <span>{yard.animMints.length}</span>
          </div>
        </div>
        <div className="yard-action">
          <button className="unstake-button" onClick={() => handleUnstake()}>
            {/* {unstakeLoading ? */}
            {/* <ClipLoader color="#fff" size={18} /> */}
            {/* : */}
            <>unstake</>
            {/* } */}
          </button>
          <button className="collapse-button">
            {open ?
              <KeyboardArrowUpRoundedIcon style={{ fontSize: 30 }} />
              :
              <KeyboardArrowDownRoundedIcon style={{ fontSize: 30 }} />
            }
          </button>
        </div>
      </div>
      <Collapse in={open}>
        <div className="yard-content">
          <div className="yard-group">
            <StakedNFTCard mint={yard.landMint} />
          </div>
          <div className="yard-group">
            {yard.farmerMints.map((item, key) => (
              <StakedNFTCard mint={item} key={key} />
            ))}
          </div>
          <div className="yard-group">
            {yard.animMints.map((item, key) => (
              <StakedNFTCard mint={item} key={key} />
            ))}
          </div>
        </div>
      </Collapse>
      {unstakeLoading &&
        <LoadingPage />
      }
    </div>
  )
}