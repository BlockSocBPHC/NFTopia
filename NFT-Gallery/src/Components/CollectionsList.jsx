import React from 'react'
import Section from './Section'
import CollectionCards from './CollectionCards'

const CollectionsList = () => {
  return (
    <Section crosses customPaddings className="pt-[6rem] -mt-[5.25] px-[7rem]" >
        <div className='relative pb-[4rem]'>
            <h2 className='h2'>Recently Listed Collections:</h2>
        </div>
        <div className='relative flex space-x-[3rem] overflow-x-scroll  '>
            <CollectionCards className="hover:scale-90 transition-transform delay-[5] duration-[50] ease-in-out" />
            <CollectionCards className="hover:scale-90 transition-transform delay-50" />
            <CollectionCards className="hover:scale-90 transition-transform delay-50" />
            <CollectionCards className="hover:scale-90 transition-transform delay-50" />
            <CollectionCards className="hover:scale-90 transition-transform delay-50" />
            <CollectionCards className="hover:scale-90 transition-transform delay-50" />
        </div>
    </Section>
  )
}

export default CollectionsList
