import "./home.css";
import { Contract, ethers } from "ethers";
import { useEffect, useState, useContext } from "react";
import contractABI from "../../contractABI.json"
import context from "../../Context/context";

const contractAddress = "0x19F25e8b77477a94938746489F386B70c68b27a8";

export default function Home() {

  const {NFTContract,setNFTContract} = useContext(context);
  
  const [account, setAccount] = useState(null);
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
      })
      .catch((error) => {
        alert("Something went wrong");
      });

  }

  async function disconnectWallet() {
    if (window.ethereum) {
      try {
        setAccount(null);
      } catch (error) {
        console.error("An error occurred while disconnecting the wallet:", error);
      }
    }
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
          const uris = await NFTContract.GetAvailableNFTs();
          const _data = [];
          for (const uri of uris) {
            const imgSrc = await getImageSrc("https://gateway.pinata.cloud/ipfs/" + uri);
            _data.push({
              url: imgSrc,
              param: "ipfs://" + uri
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


  async function withdrawMoney() {
    try {
      const response = await NFTContract.withdrawMoney();
      console.log("Received: ", response);
    } catch (err) {
      alert(err);
    }
  }
  
  if (!isCorrectNetwork) {
    return (
      <div className="container">
        <br />
        <h2>Switch to the Polygon Mumbai Network</h2>
        <p>Please switch to the Polygon Mumbai network to use this app.</p>
      </div>
    );
  }

  async function handleMint(tokenURI) {
    setIsMinting(true);
    try {
      const options = { value: ethers.utils.parseEther("0.01") };
      const response = await NFTContract.mintNFT(tokenURI, options);
      console.log("Received: ", response);
    } catch (err) {
      alert(err);
    } finally {
      setIsMinting(false);
    }
  }

  if (account === null) {
      return (
        <>
          <div className="bg-slate-300 justify-center text-center content-center bg-auto bg-repeat min-h-svh">
            <div className= "translate-y-8">
              <br />
              <h2 className="text-3xl">NFT Marketplace</h2>
              <p className="my-2 text-xl">Buy an NFT from our marketplace.</p>

              {isWalletInstalled ? (
                <button className="connect-button bg-orange-700 px-2 py-2 rounded-md text-white text-center my-4"
                onClick={connectWallet}>Connect Wallet</button>
                ) : (
                  <p>Install Metamask wallet</p>
                  )}
            </div>
          </div>
        </>
    );
}


  return (
    <div className="bg-auto bg-slate-300 min-h-svh">
    <>
      <div className="container">
        <br />

        <h1>NFT Marketplace</h1>
        <p>A NFT Marketplace to view and mint your NFT</p>
        {data.map((item, index) => (
          <div className="imgDiv">
            <img
              src={item.url}
              key={index}
              alt= "NFT Image"
              width={150}
              height={150}
              border={2}
            />
            <button
              className="px-2 py-1 rounded-md bg-orange-700 text-white hover:bg-slate-800"
              disabled = {isMinting}
              onClick={() => {
                handleMint(item.param);
              }}
            >
              Mint - 0.01 MATIC
            </button>
          </div>
        ))}
        <div className="withdraw_container">
        <button className="my-4 p-2 rounded-md bg-orange-800 text-white hover:bg-slate-950"
          onClick={() => {
            withdrawMoney();
          }}
        >
          Withdraw Money from Contract
        </button>
        </div>
        <button className="disconnect-button" onClick={disconnectWallet}>Disconnect Wallet</button>
      </div>
    </>
    
    </div>
    
  );
}
