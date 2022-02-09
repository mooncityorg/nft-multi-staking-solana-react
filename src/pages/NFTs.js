import { Grid } from "@material-ui/core";
import NFTCard from "../components/NFTCard";
import { ANIMAL_MAX, FARMER_MAX, LAND_MAX } from "../config";
import ClipLoader from "react-spinners/ClipLoader";

export default function NFTs({
  spleteNFTs,
  selectNFTs,
  removeItem,
  landNfts,
  farmerNfts,
  animalNfts,
  stakeDisable,
  stakeLoading,
  onStakeToYard,
  landSelected,
  farmerSelected,
  allUncheck,
  animalSelected,
  ...props }) {

  return (
    <div className="main-content">
      <div className="stake-total">
        <p>Selected NFTs</p>
        <div className="stake-total-content">
          <div className="count-items">
            <div className="item">
              <p>land</p>
              <h5>{landSelected.length}</h5>
            </div>
            <div className="item">
              <p>farmer</p>
              <h5>{farmerSelected.length}</h5>
            </div>
            <div className="item">
              <p>animal</p>
              <h5>{animalSelected.length}</h5>
            </div>
          </div>
          <button
            className="stake-button"
            onClick={() => onStakeToYard()}
            disabled={stakeDisable || stakeLoading}
          >
            {stakeLoading ?
              <ClipLoader color="#fff" size={24} />
              :
              <>Stake now</>
            }
          </button>
        </div>
      </div>
      <div className="nfts-content">
        <div className="collection-box">
          <h2>Land({landNfts.length})</h2>
          <div className="collection-content">
            <Grid container spacing={2}>
              {landNfts.length !== 0 ? landNfts.map((item, key) => (
                <Grid item md={6} xs={12} key={key}>
                  <NFTCard
                    uri={item.data.uri}
                    mint={item.mint}
                    max={LAND_MAX}
                    selected={landSelected.length}
                    allUncheck={allUncheck}
                    selectNFTs={(checked) => selectNFTs(1, item.mint, checked)}
                  />
                </Grid>
              )) : <p className="empty-nft">There is no Land NFT</p>}
            </Grid>
          </div>
        </div>
        <div className="collection-box">
          <h2>Farmers({farmerNfts.length})</h2>
          <div className="collection-content">
            <Grid container spacing={2}>
              {farmerNfts.length !== 0 ? farmerNfts.map((item, key) => (
                <Grid item md={6} xs={12} key={key}>
                  <NFTCard
                    uri={item.data.uri}
                    mint={item.mint}
                    max={FARMER_MAX}
                    selected={farmerSelected.length}
                    allUncheck={allUncheck}
                    selectNFTs={(checked) => selectNFTs(2, item.mint, checked)}
                  />
                </Grid>
              ))
                :
                <p className="empty-nft">There is no Farmer NFT.</p>}
            </Grid>
          </div>
        </div>
        <div className="collection-box">
          <h2>Animals({animalNfts.length})</h2>
          <div className="collection-content">
            <Grid container spacing={2}>
              {animalNfts.length !== 0 ? animalNfts.map((item, key) => (
                <Grid item md={6} xs={12} key={key}>
                  <NFTCard
                    uri={item.data.uri}
                    mint={item.mint}
                    max={ANIMAL_MAX}
                    selected={animalSelected.length}
                    allUncheck={allUncheck}
                    selectNFTs={(checked) => selectNFTs(3, item.mint, checked)}
                  />
                </Grid>
              )) : <p className="empty-nft">There is no Animal NFT</p>}
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
}
