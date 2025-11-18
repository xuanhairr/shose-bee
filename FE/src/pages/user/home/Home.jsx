import React from 'react'
import NavbarUser from '../../../components/navbar/NavbarUser'
import Fillter from '../../../components/fillter/Fillter'

function Home() {
  return (
    <div>
      <div className="row">
      <NavbarUser></NavbarUser>
      </div>
      <div className="row">
        <Fillter></Fillter>
      </div>
        
    </div>
  )
}

export default Home