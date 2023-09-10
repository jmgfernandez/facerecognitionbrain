import React from "react";
import Tilt from 'react-parallax-tilt';
import brain from './brain.png';
import './Logo.css';

const Logo = () => {
    return (
        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} >
            <div style={{ height: '150px', width: '150px' }} className="Tilt ma4 mt0 br2 shadow pa3">
                <img style={{paddingTop: '5px'}} alt='logo' src={brain}  />
            </div>    
        </Tilt>
    );
}

export default Logo;