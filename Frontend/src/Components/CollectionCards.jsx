import React from 'react'
import { robot } from '../assets'

const CollectionCards = ({
    onClick,
    CollectionName,
    votes,
    artist,
    img,
    className,
}) => {
  return (
    <div className= {`cursor-pointer ${className || ""}`} onClick={onClick}>
      <div className='relative w-[23rem] md:w-[20rem] '>
                <div className='relative z-1 p-0.5 rounded-2xl bg-conic-gradient'>
                    <div className='relative bg-n-8 rounded-[1rem]'>

                        <div className='aspect-[100/130] rounded-b-[0.9rem] overflow-scroll flex flex-col'>
                            <div className='aspect-square scale-[80%] overflow-hidden rounded-[2rem] flex'>
                                <img src={img || robot} className='' width={1024} height={490} alt = "AI"/>
                            </div>
                            <div className='overflow text-center'>
                                <h6 className='h6 -mt-[1rem] '>{CollectionName || "Name of the Collection"}</h6>
                            </div>
                            <div className='h7 leading-relaxed px-8 pb-2 flex justify-between '>
                                <div className='text-center'>
                                    <h7> ARTIST </h7> <br/>
                                    <h7> {artist || "-"} </h7>
                                </div>
                                
                                <div className='mt-[0.4rem] w-[0.125rem] bg-n-4/60 rounded-md'/>

                                <div className='text-center'>
                                <h7> VOTES </h7> <br/>
                                <h7> {votes || "0"} </h7>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
    </div>
  )
}

export default CollectionCards
