import {React, useContext, useEffect, useRef, useState} from 'react'
import {cross, curve} from "../assets"
import Button from './Button'
import context from '../Context/context';
const Popup = ({
        id,
        onClose,
        children,
        isOpen,
        setIsOpen,
    }) => {

    const popupRef = useRef(null);
  
    const handleClose = () => {
      setIsOpen(false);
      onClose && onClose(); // Call the passed onClose function if available
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (isOpen && popupRef.current && !popupRef.current.contains(event.target)) {
            setIsOpen(false);
          }
        };
      
        document.addEventListener('mousedown', handleClickOutside);
      
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [isOpen, popupRef]);
  

  return (
    <div ref={popupRef} className={`${isOpen ? "" : "hidden"} fixed bottom-[50vh] left-[50vw] -translate-x-[50%] translate-y-[50%] z-10 bg-n-6/80 w-[30vw] backdrop-blur-sm p-8 flex flex-cols`}>
            {/* <div className=''>
                <h4 className='h4'>Hello I am A popup</h4>
            </div> */}
            <div className='flex-grow'>
            <div className='py-3 flex flex-col space-y-[0.5rem] mt-4 items-center '>
                {isOpen && children}
            </div>
                
            </div>
            <div className='relative hover:cursor-pointer' onClick={handleClose}>
                <div className='relative -m-4 '>
                    <div className=''>
                        <img src={cross} width={30}/>
                    </div>
                </div>
                
            </div>
        </div>
  )
}

export default Popup
