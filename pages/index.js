import React from 'react'
//internal import
import {HeroSection , Service} from '../components/componentindex'
import Style from '../styles/index.module.css'

function Home() {
  return (
    
    <div className={Style.homePage}>
      <HeroSection/>
      <Service/>
    </div>

  )
}

export default Home