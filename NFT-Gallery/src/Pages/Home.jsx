import React, { useContext,useEffect, useState } from 'react';
import ButtonGradient from "../././assets/svg/ButtonGradient";
import Button from '../Components/Button';
import Header from '../Components/Header';
import Hero from '../Components/Hero';
import DisplayHero from '../Components/DisplayHero';
import { BottomLine } from '../Components/design/Hero';
import CollectionsList from '../Components/CollectionsList';
import Popup from '../Components/Popup';
import { curve } from '../assets';
import context from "../Context/context"
import {Contract, ethers} from "ethers"
import contractABI from "../contractABI.json"


const Home = () => {

    const contractAddress = "0x6B4CC2D22D8C817618fF77F69610A42EcC32E619";

    const [isNewAccountOpen, setIsNewAccountOpen] = useContext(context).newAccount;
    const [isSignInOpen, setIsSignInOpen] = useContext(context).signIn
    const [NFTContract,setNFTContract] = useContext(context).contract;
    const [isWalletConnected, setIsWalletConnected] = useContext(context).walletConnect;
    // console.log(useContext(context));
    
    const [account, setAccount] = useContext(context).account;
    const [ data, setData ] = useState([]);
    const [isWalletInstalled, setIsWalletInstalled] = useState(false);

    // state for whether app is minting or not.
    const [isMinting, setIsMinting] = useState(false);
    const [isCorrectNetwork, setIsCorrectNetwork] = useState(false); // Added state for network check

    // Check if the current network is the correct network
    useEffect(() => {
        async function checkNetwork() {
        if (window.ethereum) {
            const chainId = await window.ethereum.request({ method: "eth_chainId" });
            setIsCorrectNetwork(chainId === "0x13881"); // Change to the correct chain ID
        }
        }
        //check for initial network
        checkNetwork();

        //Check for network change
        window.ethereum.on("chainChanged", (newChainId) => {
        setIsCorrectNetwork(newChainId === "0x13881"); // Change to the correct chain ID
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
        // console.log( "USEEFFECT :" , account );
        }
        initNFTContract();
    }, [account]);

    async function connectWallet() {
        window.ethereum
        .request({
            method: "eth_requestAccounts",
        })
        .then((accounts) => {
            setAccount(accounts[0]);

            setIsWalletConnected(true);
        })
        .catch((error) => {
            alert("Something went wrong");
            setIsWalletConnected(false);
        });

    }

    async function getImageSrc(metaURL) {
        const response = await fetch(metaURL);
        const data = await response.json();
        return ( "https://gateway.pinata.cloud/ipfs/" + data.image.slice(7) );
    }
    
    useEffect( () => {
        async function getData()
        {
        if( NFTContract !== null  )
        {
            if ( NFTContract.signer._address !== null )
            {
            console.log("GETTING>>>>>>>")
            const tokens = await NFTContract.GetAvailableNFTs();
            const _data = [];
            for (const token of tokens) {
                // console.log(token)
                const imgSrc = await getImageSrc("https://gateway.pinata.cloud/ipfs/" + token.uri);
                _data.push({
                url: imgSrc,
                token_id: token.id,
                collection_id: 1,         /////////////////////////////////////////////
                param: "ipfs://" + token.uri
                });
            }
            console.log( _data[0])
            setData(_data);
            // console.log( uris );
            }
        }
        }
        
        console.log("getting");
        setTimeout(() => { getData() }, 3000);
        console.log(data);
    },[NFTContract])


    // async function withdrawMoney() {
    //     try {
    //     const response = await NFTContract.withdrawMoney();
    //     console.log("Received: ", response);
    //     } catch (err) {
    //     alert(err);
    //     }
    // }
    
    if (!isCorrectNetwork) {
        return (
            
      <Popup isOpen={true} className="container">
        <br />
        <h2>Switch to the Polygon Mumbai Network</h2>
        <p>Please switch to the Polygon Mumbai network to use this app.</p>
      </Popup>
    );
  }

//   async function handleMint(collection_id, token_id) {
//     setIsMinting(true);
//     try {
//       const options = { value: ethers.utils.parseEther("0.01") };
//       const response = await NFTContract.mintNFT(collection_id, token_id, options);
//       console.log("Received: ", response);
//     } catch (err) {
//       alert(err);
//     } finally {
//       setIsMinting(false);
//     }
//   }

    return (
        <div>
            <div className='pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden'>
                <DisplayHero />
                <CollectionsList />
                <Popup id='newAccountPopup' isOpen= {isNewAccountOpen} setIsOpen={setIsNewAccountOpen} >
                    <h1 className="h4">New Account</h1>
                    <img src={curve} width={150}className='relative -top-[0.75rem] self-center '/>
                    <h5 className='h6'>Username :</h5>
                    <input type="text" onChange={ (e) => setCollectionName(e.target.value) } className = "border-n-4/40 border-2 hover:border-n-4/70 focus:outline-none focus:border-n-4/100 bg-inherit rounded-[0.8rem] px-4 py-1 shadow-md max-w-[20rem] h-[2.5rem] h7" placeholder='Enter username' /> <br />
                    <Button onClick={() =>{connectWallet(); setIsNewAccountOpen(false)}}>Connect Metamask</Button>
                </Popup>

                <Popup id='signInPopup' isOpen={isSignInOpen} setIsOpen={setIsSignInOpen}>
                    <h1 className="h4">Signin</h1>
                    <img src={curve} width={150}className='relative -top-[0.75rem] self-center '/>
                    
                    <Button onClick={() => { connectWallet(); setIsSignInOpen(false) }}>Connect Metamask</Button>
                </Popup>
            </div>
            <ButtonGradient />
        </div>
    );
}
export default Home;
