import React, { useState } from 'react'
import CollectionCards from '../Components/CollectionCards'
import { extractData } from './Home';
import { useEffect,useContext } from 'react';
import context from "../Context/context"
const MyNfts = () => {

  const [myNftData, setMyNFTData] = useState([]);
  const [account, setAccount] = useContext(context).account;
  const [NFTContract, setNFTContract] = useContext(context).contract;
  useEffect( () => {
    async function getData()
    {
    if( NFTContract !== null  )
    {
        if ( NFTContract.signer._address !== null )
        {
            console.log("GETTING>>>>>>>")
            const tokens = await NFTContract.GetNFTsByOwner(account);
            const _data = await extractData(tokens);
            setMyNFTData(_data);
        // console.log( uris );
        }
    }
    }
    
    console.log("getting");
    setTimeout(() => { getData() }, 3000);
    console.log(myNftData);
},[NFTContract])

  return (
    <div className='container mt-[10rem] min-w-full text-center'>
        <h1 className='h1'>My NFTs:</h1>
        <div className='p-4 grid-cols-4 grid overflow-hidden gap-y-8'>
          {myNftData.map((item, index) => (
          <CollectionCards 
            key = {item.collection_id}
            className="hover:scale-90 transition-transform delay-[5] duration-[50] ease-in-out" 
            img = {item.url}
            CollectionName={item.name}
            artist={item.artist}
          />
          ))}
        </div>    
    </div>
  )
}

export default MyNfts
