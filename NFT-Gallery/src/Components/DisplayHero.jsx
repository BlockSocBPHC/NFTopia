import Section from './Section'
import { displayHero,displayArrow } from '../assets'
import { BgRings, BottomLine } from './design/Hero'
import { ScrollParallax } from "react-just-parallax"
import React, { useRef } from 'react'
import Button from './Button'


const DisplayHero = () => {
    const parallaxRef = useRef(null);
  return (
    <Section className="pt-[12rem] -mt-[5.25] h-[20rem] lg:h-[46rem] overflow-hidden" crosses customPaddings id="hero">
      <div className= "container relative bg-n-6/30" >
        <div className='relative z-1 mx-[5rem] flex grow'>
            <BgRings parallaxRef={parallaxRef} />
            <div className='relative -translate-y-[8rem] scale-[130%] flex-shrink-0'>
                <img src={displayHero} width={400}/> 
            </div>
            <div className='relative -top-[8rem] ml-[13rem] space-y-[2.5rem]'>
                <h1 className=' h1 leading-tight shadow-white text-shadow-[white_5px_6px_10px]'>
                    Discover,<br/> collect and sell dope NFTs</h1>
                <p className='body-1 px-4 text-xl leading-relaxed text-n-3/80'>
                    Explore new avenues of revenue by putting up your NFTs for sale.</p>
                <div className=" text-center space-x-10">
                <Button white>
                        Start Buying
                    </Button>
                    <Button >
                        Start Selling
                    </Button>
                </div>
                <div className='flex space-x-4 items-center'>
                    <img src={displayArrow} width={30} />
                    <span className='body-2'>Developed by blocksoc</span>
                </div>
                <div className='flex space-x-4 items-center'>
                    <img src={displayArrow} width={30} />
                    <span className='body-2'>Developed by blocksoc</span>
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
