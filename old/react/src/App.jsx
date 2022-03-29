import { createRef } from 'react';
import Game from './components/Game';
import SideBar from './components/SideBar';

function App() {
  const game = createRef()
  return (
    <div className="flex">
      <SideBar game={game}/>
      <Game ref={game} />
    </div>
  );
}

export default App;
