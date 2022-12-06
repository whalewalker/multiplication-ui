import './App.css';
import Challenge from './component/Challenge';
import React from 'react';
import LeaderBoard from './component/LeaderBoard';

const App = () => {
  return (
    <div className="App">
      <Challenge/>
      <LeaderBoard/>
    </div>
  );
}

export default App;
