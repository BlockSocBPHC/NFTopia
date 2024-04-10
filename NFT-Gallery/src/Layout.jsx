import {Outlet} from 'react-router-dom'
import Header from './Components/Header'
import React, { useContext,useEffect, useState } from 'react';
import Button from './Components/Button';
import Popup from './Components/Popup';
import context from "./Context/context"


function Layout()
{
    const [isSignInOpen, setIsSignInOpen] = useContext(context).signIn
    const [NFTContract,setNFTContract] = useContext(context).contract;
    const [isWalletConnected, setIsWalletConnected] = useContext(context).walletConnect;
    // console.log(useContext(context));
    
    const [username, setUsername] = useContext(context).username;
    const [account, setAccount] = useContext(context).account;
    const [ data, setData ] = useContext(context).data;
    const [isWalletInstalled, setIsWalletInstalled] = useState(false);
    const [isCollectionPopupOpen, setIsCollectionPopupOpen] = useContext(context).collectionPopupOpen;
    const [collectionCardPopupData, setCollectionCardPopupData] = useContext(context).collectionPopup;

    async function addVote( collectionData )
    {
        await NFTContract.AddVote(collectionData.collectionId, collectionData.tokenId, username, { gasLimit: ethers.BigNumber.from("400000"), gasPrice: ethers.utils.parseUnits("40", "gwei")} );
    }
    
    return (
        <>
        <Header />
        <Outlet />
        {/* <Footer /> */}
        <Popup id="CollectionCardPopup" isOpen = {isCollectionPopupOpen} setIsOpen={setIsCollectionPopupOpen}>
            <h5 className='h5'> Peole Who voted for this collection:  </h5>
            {collectionCardPopupData.voters && collectionCardPopupData.voters.map((voter, index) => (
                <li className='h6' key={index}>{voter}</li>
            ))}
            <Button onClick={() => addVote(collectionCardPopupData)}> Vote </Button>
        </Popup>
        </>
    )
}

export default Layout