import React from "react";
import './FaceRecognition.css';

const FaceRecognition = ({ box, imageUrl }) => {
    return (
        <div className='center ma3'>
            <div className='absolute nt2'>
                <img id='inputimage' src={imageUrl} alt='' width='500px' height='auto' />
                <div className='bounding-box' style={{left: box.leftCol, right: box.rightCol, top: box.topRow, bottom: box.bottomRow}}></div>
            </div>
            
        </div>
    );
}

export default FaceRecognition;