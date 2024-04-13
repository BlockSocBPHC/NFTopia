import Section from './Section'
import { displayHero,displayArrow } from '../assets'
import { BgRings, BottomLine } from './design/Hero'
import React, { useContext, useRef } from 'react'
import {useNavigate} from "react-router-dom"
import Button from './Button'
import context from "../Context/context"

const DisplayHero = () => {
    
    const [isSignInOpen, setIsSignInOpen] = useContext(context).signIn;
    const [account, setAccount] = useContext(context).account;
    const parallaxRef = useRef(null);

    let navigate = useNavigate(); 
    const routeChange = (path) =>{
      navigate(path);
    }
    

  return (
    <Section className="pt-[12rem] -mt-[5.25] h-[34rem] lg:h-[46rem] md:h-[44rem] sm:h-[42rem] overflow-hidden" crosses customPaddings id="hero">
      <div className= "container relative bg-n-6/30" >
        <div className='relative z-1 mx-[5rem] flex lg:flex-row grow '>
            <BgRings parallaxRef={parallaxRef} />
            <div className='relative -translate-y-[12rem] -translate-x-[3rem] lg:translate-x-0  md:scale-[100%] lg:-translate-y-[8rem] lg:scale-[130%] scale-[75%] flex-shrink-0'>
                <img src={displayHero} width={400}/> 
            </div>
            <div className='relative lg:-top-[8rem] lg:ml-[13rem] lg:space-y-[2.5rem]'>
                <h1 className=' h1 leading-tight shadow-white text-shadow-[white_5px_6px_10px]'>
                    Discover,<br/> collect and sell dope NFTs</h1>
                <p className='body-1 px-4 text-xl leading-relaxed text-n-3/80'>
                    Explore new avenues of revenue by putting up your NFTs for sale.</p>
                <div className=" text-center space-x-10">
                <Button white onClick = {() => {!account ? setIsSignInOpen({id:'signInPopup',open:true}) : window.location.hash = '#Collections List'  } } >
                        View Collections
                    </Button>
                    <Button onClick = {() => {!account ? setIsSignInOpen({id:'signInPopup',open:true}) : routeChange(`list_nfts`) }} >
                        List Your NFT
                    </Button>
                </div>
                <div className='flex space-x-4 items-center'>
                    <img src={displayArrow} width={30} />
                    <span className='body-2'>Unlock Creativity: Your NFT Journey Begins Here</span>
                </div>
                <div className='flex space-x-4 items-center'>
                    <img src={displayArrow} width={30} />
                    <span className='body-2'>NFTopia: Demystify NFTs</span>
                </div>
                <div className='flex space-x-4 items-center'>
                    <img src={displayArrow} width={30} />
                    <span className='body-2'>Developed by blocksoc</span>
                </div>
            </div>
        </div>
      </div>
    </Section>
  )
}

export default DisplayHero
