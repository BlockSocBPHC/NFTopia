import React, {useState} from 'react'

import context from './context'

const ContextProvider = ( {children} )=> {
    const [NFTContract,setNFTContract] = useState(null);
    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const [isNewAccountOpen, setIsNewAccountOpen] = useState(false);
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [account, setAccount] = useState(null);
    return(
            <context.Provider value={{ contract: [NFTContract,setNFTContract], signIn: [isSignInOpen, setIsSignInOpen], 
            newAccount:[isNewAccountOpen,setIsNewAccountOpen],
            walletConnect:[isWalletConnected,setIsWalletConnected],
            account: [account,setAccount],
         }}> 
            {children}
        </context.Provider>
    )
}

export default ContextProvider