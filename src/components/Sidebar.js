import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ClickAwayListener from '@mui/material/ClickAwayListener';

export default function Sidebar({
  rewardValue,
  onClaimReward,
  claimLoading,
  openSidebar,
  setOpenSidebar,
  ...props }) {
  const navigate = useNavigate()
  const handleRouter = (url) => {
    navigate(url)
    setOpenSidebar(true)
  }

  return (
    <ClickAwayListener onClickAway={() => setOpenSidebar(true)}>
      <div className={openSidebar ? "sidebar" : "sidebar sidebar-mobile"}>
        <div className={openSidebar ? "mobile-action" : "mobile-action mobile-action-open"}>
          <button onClick={() => setOpenSidebar(!openSidebar)}>
            {!openSidebar ? <MenuOpenRoundedIcon style={{ color: "#fff" }} /> : <MenuRoundedIcon style={{ color: "#fff" }} />}
          </button>
        </div>
        <div className="sidebar-content">
          <h1>Barnyard</h1>
          <p className="reward-title">rewards for claim</p>
          <h2>{rewardValue}<span style={{ marginLeft: 5 }}>$Wheat</span></h2>
          <button className="claim-button" onClick={() => onClaimReward()} disabled={claimLoading}>
            {claimLoading ?
              <ClipLoader color="#fff" size={24} />
              :
              <>claim</>
            }
          </button>
        </div>
        <div className="side-nav">
          <ul>
            <li>
              <button onClick={() => handleRouter("/")}>
                My NFTs
              </button>
            </li>
            <li>
              <button onClick={() => handleRouter("/yards")}>
                Staked Yards
              </button>
            </li>
          </ul>
        </div>
      </div>
    </ClickAwayListener>
  )
}