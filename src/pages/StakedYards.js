import YardItem from "../components/YardItem";
import { useNavigate } from "react-router-dom";

export default function StakedYards({ yards, onWithdrawFromYard, unstakeLoading, ...props }) {
  const navigate = useNavigate()
  return (
    <div className="main-content">
      {yards.yards.length !== 0 ?
        yards.yards.map((item, key) => (
          <YardItem
            key={key}
            yard={item}
            onWithdrawFromYard={onWithdrawFromYard}
            unstakeLoading={unstakeLoading}
            number={key + 1}
            stakedTime={item.stakedTime}
          />
        ))
        :
        <div className="empty-yards">
          <p>There is no Steaked Yard.</p>
          <button className="to-nfts" onClick={() => navigate("/")}>
            Go to Stake
          </button>
        </div>
      }
    </div>
  );
}
