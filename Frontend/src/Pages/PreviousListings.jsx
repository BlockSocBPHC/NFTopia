import React, { useState } from 'react'
import CollectionCards from '../Components/CollectionCards'
import { extractData } from './Home';
import { useEffect,useContext } from 'react';
import context from "../Context/context"
import GridLoader from "react-spinners/GridLoader";

const PreviousListings = () => {
    
    const [previouslyListedData, setPreviouslyListedData] = useState([]);
    const [account, setAccount] = useContext(context).account;
    const [NFTContract, setNFTContract] = useContext(context).contract;
    const [isCollectionPopupOpen, setIsCollectionPopupOpen] = useContext(context).collectionPopupOpen;
    const [collectionCardPopupData, setCollectionCardPopupData] = useContext(context).collectionPopup;
    const [isCollectionPopupVoteDisabled, setIsCollectionPopupVoteDisabled] = useContext(context).popupVoteDisabled;
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect( () => {
    async function getData()
    {
    if( NFTContract !== null  )
    {
        if ( NFTContract.signer._address !== null )
        {
            console.log("GETTING>>>>>>>")
            const tokens = await NFTContract.GetAllNFTs(account);
            const _data = await extractData(tokens);
            setPreviouslyListedData(_data);
            setIsLoading(false);
        }
    }
    }

    console.log("getting");
    setTimeout(() => { getData() }, 3000);
    console.log(previouslyListedData);
},[NFTContract])

    async function onCollectionCardClicked( data )
    {
        setIsCollectionPopupVoteDisabled(true);
        setIsCollectionPopupOpen(true);  
        setCollectionCardPopupData(data);
    }

    return (
        <div className='container mt-[10rem] min-w-full text-center'>
            {!isLoading && (
            <div>
                { previouslyListedData.length > 0 ?
                    <h3 className='h3'>Previously Listed NFTs:</h3>
                    :
                    <h3 className='h3'>No NFTs to show</h3>
                }
                <div className='p-4 grid-cols-5 grid overflow-hidden gap-y-6'>
                {previouslyListedData.map((item, index) => (
                    <CollectionCards 
                    key = {item.collection_id}
                    className="hover:scale-[80%] scale-90 transition-transform delay-[5] duration-[50] ease-in-out" 
                    img = {item.url}
                    CollectionName={item.name}
                    artist={item.artist}
                    votes = {item.voters.length}
                    onClick={() => onCollectionCardClicked({
                        collectionId: item.collection_id.toNumber(),
                        tokenId: item.token_id.toNumber(),
                        collectionName: item.name,
                        voters: item.voters})}
                    />
                ))}
                </div>    
            </div>)}   

            <div className='flex justify-center'>
                        <GridLoader
                            loading={isLoading}
                            size= {50}
                            color="#ffffff"
                            margin={20}
                            width = {100}
                        />
                </div> 
            
        </div>
      )
}

export default PreviousListings
