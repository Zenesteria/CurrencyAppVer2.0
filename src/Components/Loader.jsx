import React from 'react'

export default function Loader({show}) {
  return (
    <div className="hidden items-center justify-around flex-col rounded-full overflow-hidden w-[100px] h-[100px]" style={{display:show&&'flex'}}>
        <BarsOne name='topbar'/>
        <BarsOne name='midbar'/>
        <BarsOne name='botbar'/>
    </div>
  )
}

const BarsOne = ({name}) => {
    return <div className="w-[120%] h-[15px] bg-red-300" id={name} ></div>
}
