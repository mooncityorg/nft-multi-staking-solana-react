import { Skeleton } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { useEffect, useRef, useState } from 'react';

export default function NFTCard({
  mint,
  uri,
  max,
  selectNFTs,
  selected,
  allUncheck,
  ...props
}) {
  const ref = useRef();
  const [width, setWidth] = useState(0)
  const [nftname, setNftname] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  const getDetail = async () => {
    setLoading(true);
    await fetch(uri).then(resp =>
      resp.json()
    ).then((json) => {
      setNftname(json.name)
      setImage(json.image)
    })
    setLoading(false);
  }

  const handleCheck = () => {
    setChecked(!checked);
    selectNFTs(!checked);
  }

  useEffect(() => {
    getDetail()
    setWidth(ref.current?.clientWidth);
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    setChecked(false)
    // eslint-disable-next-line
  }, [allUncheck])

  return (
    <div className="nft-card" ref={ref}>
      <div className="card-check" onClick={() => handleCheck()}>
        <Checkbox size="small" checked={checked} />
      </div>
      {loading ?
        <Skeleton style={{ width: width, height: width, borderRadius: "6px 6px 0 0" }} variant="rectangular" animation="wave" />
        :
        <img
          src={image}
          alt={nftname}
          style={{ width: width, height: width }}
        />
      }
      {loading ?
        <>
          <Skeleton width="60%" height={22} style={{ margin: 10 }} />
        </>
        :
        <p>{nftname}</p>
      }
    </div>
  )
}