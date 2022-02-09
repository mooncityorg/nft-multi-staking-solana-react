import { Skeleton } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { getNftMetaData } from '../contexts/helpers';

export default function StakedNFTCard({
  mint,
  ...props
}) {
  const ref = useRef();
  const [width, setWidth] = useState(0)
  const [nftname, setNftname] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const getDetail = async () => {
    setLoading(true);
    const uri = await getNftMetaData(mint)
    await fetch(uri.data.data.uri).then(resp =>
      resp.json()
    ).then((json) => {
      setNftname(json.name)
      setImage(json.image)
    })
    setLoading(false);
  }

  useEffect(() => {
    getDetail()
    setWidth(ref.current?.clientWidth);
    // eslint-disable-next-line
  }, [])

  return (
    <div className="nft-card" ref={ref}>
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