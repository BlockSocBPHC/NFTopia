// import React from 'react'
import { React, useState,useContext,useRef } from 'react'
import FormData from 'form-data';
import axios from "axios"
import context from '../Context/context';
import {ethers} from 'ethers'
import { plus } from '../assets';

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_API_Secret
const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_Key

const Sell = () => {
    const [NFTContract,setNFTContract] = useContext(context).contract
    const [file, setFile] = useState();
    const [fileName, setFileName] = useState("");
    const [ collectionName, setCollectionName ] = useState();
    const [username, setUsername] = useContext(context).username;
    const inputRef = useRef();

    function handleChange(e) {
        console.log(e.target);
        setFileName(e.target.value.split("\\").pop());
        setFile(URL.createObjectURL(e.target.files[0]));
    }

    async function submitNFT()
    {
        if(NFTContract == null)
        {
            console.log("Contract is null");
            return;
        }
        if( NFTContract.signer._address == null)
        {
            console.log("Signer Adress is null");
            return;
        }

        const formData = new FormData();
        let blob = await fetch(file).then(r => r.blob());
            formData.append("file", blob)

        const metadata = JSON.stringify({
            name: collectionName + "_" + blob.name,
        });
        formData.append('pinataMetadata', metadata);
    
        const options = JSON.stringify({
            cidVersion: 0,
        })
        formData.append('pinataOptions', options);
    
        try{
            const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                'Authorization' : "Bearer "+ PINATA_JWT,
            }
            });
            
            const meta_formData = new FormData();
            const metadata = {
                pinataContent: {
                    name: collectionName,
                    image: "ipfs://" + res.data.IpfsHash,
                    description: "This is a test dynamic NFT implementation",
                    artist: username,
                },
                pinataMetadata: { name: `${collectionName}.json`}
            }
            
            const jsonData = JSON.stringify(metadata)
            const file = new File([jsonData], 'data.json', { type: 'application/json' });

            meta_formData.append('file',file);
            // Object.keys(metadata).forEach( key => {
                // meta_formData.append("file",metadata)
            // })

            const meta = JSON.stringify({
                name: "meta_" + collectionName + "testMetaData",
            });
            formData.append('pinataMetadata', metadata);

            try
            {
                const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", jsonData, {
                headers: {
                    'Content-Type': `application/json`,
                    'Authorization' : "Bearer "+ PINATA_JWT,
                }
                });
                // console.log( NFTContract.signer);
                console.log( await NFTContract.AddNFTs( res.data.IpfsHash, { gasLimit: ethers.BigNumber.from("4000000"), gasPrice: ethers.utils.parseUnits("40", "gwei")} ) );

            }
            catch(error)
            {
                console.log(error);
            }
        } 
        catch (error) {
            console.log(error);
        }
    }

  return (
    <div className='container mt-[10rem] relative'>
      <h1 className='h1'> List Your NFTs</h1>
        <div className='px-4 py-2 bg-opacity-50'>
            <div className='py-3 flex flex-col leading-relaxed m-1'>
                <h5 className='h5'>Collection Name :</h5>
                <input type="text" onChange={ (e) => setCollectionName(e.target.value) } className = "border-n-4/40 border-2 hover:border-n-4/70 focus:outline-none focus:border-n-4/100 bg-inherit rounded-[0.8rem] px-4 py-1 shadow-md max-w-[20rem] h7" placeholder='Enter Collection Name' /> <br />
            </div>
            <div className='py-3 flex flex-col leading-relaxed m-1'>
                <h5 className='h5'>Artist's Name :</h5>
                <input type="text" value={username} className = "border-n-4/40 border-2 hover:border-n-4/70 focus:outline-none focus:border-n-4/100 bg-inherit rounded-[0.8rem] px-4 py-1 shadow-md max-w-[20rem] h7" disabled />
            </div>
            <input type="file" ref={inputRef} hidden  onChange={handleChange} />

            <div className='my-4 border border-n-4/40 hover:border-n-4/80 rounded-[1rem] px-15 py-15 flex space-x-4 items-center hover:cursor-pointer'  onClick={() => inputRef.current.click()} >
                <div className='items-center border p-8 border-n-4/40 hover:border-n-4/80 rounded-[1rem]'>
                    <img src={file || plus} className={file ? `scale-[320%] rounded-[0.2rem]`: ""} width={30} />
                </div>
                
                <div  className='h6 ml-[14rem]' >
                    <h6>{file ? fileName : "Click to upload"}</h6>
                </div>
            </div>

            <img hidden className='px-4 py-4 place-self-center' 
            src={file} height={300} width={300} />
            <button onClick={submitNFT} className='bg-orange-400 border-black my-4 rounded-md px-4 py-1'> 
                Submit
            </button>
        </div>
        </div>
  )
}

export default Sell
