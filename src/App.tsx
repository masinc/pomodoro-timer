import React, { useState } from "react";
import "./App.css";
import { CountdownTimer, CountdownTimerState } from "./CountdownTimer";

function App() {
  const [state, setState] = useState<CountdownTimerState | undefined>(
    CountdownTimerState.Reset
  );

  return (
    <div className="App">
      <CountdownTimer state={state} onComplete={() => setState(undefined)} />
      <div>
        <button onClick={() => setState(CountdownTimerState.Play)}>
          Start
        </button>
        <button onClick={() => setState(CountdownTimerState.Pause)}>
          Stop
        </button>
        <button onClick={() => setState(CountdownTimerState.Resume)}>
          Resume
        </button>
        <button onClick={() => setState(CountdownTimerState.Reset)}>
          Reset
        </button>
      </div>
    </div>
  );
}

export default App;
