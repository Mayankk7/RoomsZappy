import React from 'react'
import { Link } from 'react-router-dom'
import AOS from 'aos'
import 'aos/dist/aos.css'

AOS.init(
    {
        duration:2000
    }
);

const Loadingscreen = () => {
    return (
        <div className='row landing justify-content-center bg-dark'>
            <div className='col-md-9 my-auto text-center' style={{borderRight:'8px solid white'}}>
                
                <h2 data-aos="zoom-in" style={{color:"white", fontSize:'130px'}}>RoomBook</h2>
                <h1 data-aos="zoom-out" style={{color:"white"}}>"There is only one Boss. THE GUEST."</h1>

                <Link to="/home">
                    <button className='btn mt-5' style={{color:'black', backgroundColor:'white'}}>Get Started</button>
                </Link>
           
            </div>
        </div>
    )
}

export default Loadingscreen
