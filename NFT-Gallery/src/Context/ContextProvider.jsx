import React, {useState} from 'react'

import context from './context'

const ContextProvider = ( {children} )=> {
    const [NFTContract,setNFTContract] = useState(null);
    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [data, setData] = useState([]);
    const [account, setAccount] = useState(null);
    const [collectionCardPopupData, setCollectionCardPopupData] = useState({});
    const [isCollectionPopupOpen, setIsCollectionPopupOpen] = useState(false);

    return(
            <context.Provider value={{ contract: [NFTContract,setNFTContract], signIn: [isSignInOpen, setIsSignInOpen], 
            walletConnect:[isWalletConnected,setIsWalletConnected],
            account: [account,setAccount],
            data:[data, setData],
            username: [username,setUsername],
            collectionPopup: [collectionCardPopupData, setCollectionCardPopupData],
            collectionPopupOpen: [isCollectionPopupOpen, setIsCollectionPopupOpen],
         }}> 
            {children}
        </context.Provider>
    )
}

export default ContextProvider