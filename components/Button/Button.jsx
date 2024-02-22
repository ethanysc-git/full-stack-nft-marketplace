import React from 'react'
import Style from './Button.module.css';

function Button({btnName , handleClick}) {
  return (
    <div className={Style.box}>
      <button className={Style.button} onCanPlay={()=>handleClick()} >
        {btnName}
      </button>
    </div>
  )
}

export default Button