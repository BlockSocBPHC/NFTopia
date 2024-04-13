import {Outlet} from 'react-router-dom'
import Header from './Components/Header'
import React, { useContext,useEffect, useState } from 'react';
import Button from './Components/Button';
import Popup from './Components/Popup';
import context from "./Context/context"
import {ethers, Contract } from "ethers"
import ButtonGradient from './assets/svg/ButtonGradient';
import { curve } from './assets';
import contractABI from "./contractABI.json"
import HashLoader from "react-spinners/HashLoader";

function Layout()
{
    const contractAddress = "0x34e8dF30687501331F5331201A43790B7B40e84F";

    const [isSignInOpen, setIsSignInOpen] = useContext(context).signIn
    const [NFTContract,setNFTContract] = useContext(context).contract;
    const [isWalletConnected, setIsWalletConnected] = useContext(context).walletConnect;
    
    const [username, setUsername] = useContext(context).username;
    const [account, setAccount] = useContext(context).account;
    const [isWalletInstalled, setIsWalletInstalled] = useState(false);
    const [isCollectionPopupOpen, setIsCollectionPopupOpen] = useContext(context).collectionPopupOpen;
    const [collectionCardPopupData, setCollectionCardPopupData] = useContext(context).collectionPopup;
    const [isCollectionPopupVoteDisabled, setIsCollectionPopupVoteDisabled] = useContext(context).popupVoteDisabled;
    const [isVoteUploading, setIsVoteUploading] = useState(false);
    const [isCorrectNetwork, setIsCorrectNetwork] = useContext(context).correctNetwork; 

    useEffect(() => {
        async function checkNetwork() {
        if (window.ethereum) {
            const chainId = await window.ethereum.request({ method: "eth_chainId" });
            setIsCorrectNetwork(chainId === "0x13882");
        }
        }

        checkNetwork();

        window.ethereum.on("chainChanged", (newChainId) => {
        setIsCorrectNetwork(newChainId === "0x13882");
        },[]);
    }, []);

    useEffect(() => {
        if (window.ethereum) {
        setIsWalletInstalled(true);
        }
    }, []);

    useEffect( () => {
        async function initNFTContract() {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = await provider.getSigner(account);
            setNFTContract(new Contract(contractAddress, contractABI.abi, signer));
        }
        initNFTContract();
    }, [account]);

    async function connectWallet() {
        window.ethereum
        .request({
            method: "eth_requestAccounts",
        })
        .then( async (accounts) => {
            setAccount(accounts[0]);
            setIsWalletConnected(true);
        })
        .catch((error) => {
            alert("Something went wrong");
            setIsWalletConnected(false);
        });

    }
    async function addVote( collectionData )
    {
        try{
            setIsVoteUploading(true);
            await NFTContract.AddVote(collectionData.collectionId, collectionData.tokenId, username, { gasLimit: ethers.BigNumber.from("400000"), gasPrice: ethers.utils.parseUnits("40", "gwei")} );
        }
        catch(error){
            console.log(error);
        }
        finally
        {
            setIsVoteUploading(false);
            setIsCollectionPopupOpen(false);
        }
    }
    
    function handleSignInClick()
    {
        if(username.length == 0 ) return;
        connectWallet(); 
        setIsSignInOpen(false);
    }
    
    return (
        <>
        <Header />
        <Outlet />
        <Popup id="CollectionCardPopup" isOpen = {isCollectionPopupOpen} setIsOpen={setIsCollectionPopupOpen}>
        {(collectionCardPopupData.voters && collectionCardPopupData.voters.length > 0) ?
            <div className='text-center'>
                <h5 className='h5'> Voters: {collectionCardPopupData.voters.length} </h5>
                {collectionCardPopupData.voters.map((voter, index) => (
                    <li className='h6' key={index}>{voter}</li>
                ))}
            </div>

            :
            <h5 className='h5'> No one has voted.</h5>

            }
            { isCollectionPopupVoteDisabled || <Button onClick={() => addVote(collectionCardPopupData)} > 
                { !isVoteUploading ? "Vote" :
                <HashLoader
                    loading={isVoteUploading}
                    size= {25}
                    color="#ffffff"
                />}
            </Button>}
        </Popup>
        
        <Popup id='signInPopup' isOpen= {isSignInOpen} setIsOpen={setIsSignInOpen} >
            <h1 className="h4">Signin</h1>
            <img src={curve} width={150}className='relative -top-[0.75rem] self-center '/>
            <h5 className='h6'>Username :</h5>
            <input type="text" onChange={ (e) => setUsername(e.target.value) } value = {username} className = "border-n-4/40 border-2 hover:border-n-4/70 focus:outline-none focus:border-n-4/100 bg-inherit rounded-[0.8rem] px-4 py-1 shadow-md max-w-[20rem] h-[2.5rem] h7" placeholder='Enter username'/> <br />
            <Button onClick={handleSignInClick}>Connect Metamask</Button>
        </Popup>
        <ButtonGradient />
        </>
    )
}

export default Layout