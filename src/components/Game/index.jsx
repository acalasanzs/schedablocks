import {React, useEffect} from 'react'
import { createRef } from 'react/cjs/react.production.min';

const Game = () => {
    var joc = createRef();
    useEffect(() => {
        joc = joc.current
        console.log(joc)
      return () => {
        
      }
    },)
    
    return (
        <div className='content-container'>
          <canvas ref={joc}/>
        </div>
      );
}

export default Game