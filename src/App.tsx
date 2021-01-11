import { format, addSeconds, addMilliseconds } from "date-fns";
import React, { useEffect, useState } from "react";
import "./App.css";

const DEFAULT_TIME = addMilliseconds(addSeconds(0, 5), 99);

class CountdownTimer {
  private initialTime?: Date;
  private currentTime?: Date;
  private intervalId?: NodeJS.Timeout;

  private setTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.intervalId = setInterval(() => {
      this.currentTime = new Date();
    }, 100);
  }

  constructor(private readonly totalTime: Date = DEFAULT_TIME) {}

  start() {
    this.initialTime = new Date();
    this.currentTime = new Date();
    this.setTimer();
  }

  pause() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  resume() {
    if (this.intervalId) {
      return;
    }

    if (!(this.initialTime && this.currentTime)) {
      this.start();
      return;
    }
    const elapsedTime = this.getElapsedTime();
    this.initialTime = new Date(
      new Date().getTime() - (elapsedTime?.getTime() ?? 0)
    );
    this.setTimer();
  }

  getElapsedTime() {
    if (!(this.currentTime && this.initialTime)) {
      return;
    }

    const elapsedTime = new Date(
      this.currentTime.getTime() - this.initialTime.getTime()
    );
    if (elapsedTime > this.totalTime) {
      return this.totalTime;
    }
    return elapsedTime;
  }

  getCurrentTime() {
    const elapsedTime = this.getElapsedTime()?.getTime() ?? 0;

    return new Date(this.totalTime.getTime() - elapsedTime);
  }

  static default() {
    return new CountdownTimer(new Date(DEFAULT_TIME.getTime()));
  }
}

const TimerStates = { Start: "Start", Stop: "Stop", Pause: "Pause" } as const;
type TimerState = typeof TimerStates[keyof typeof TimerStates];
function App() {
  const [timerState, setTimerState] = useState<TimerState>(TimerStates.Stop);
  const [timer, setTimer] = useState(CountdownTimer.default);
  const [currentTime, setCurrentTime] = useState(DEFAULT_TIME);
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentTime(timer.getCurrentTime());
    });

    return () => clearInterval(id);
  }, [timerState]);

  return (
    <div className="App">
      <div>
        <div>
          <input
            type="text"
            readOnly={true}
            value={format(currentTime, "mm:ss")}
          ></input>
        </div>
        <div>
          {timerState === TimerStates.Stop ? (
            <button
              onClick={() => {
                timer.start();
                setTimerState(TimerStates.Start);
              }}
            >
              スタート
            </button>
          ) : timerState === TimerStates.Pause ? (
            <button
              onClick={() => {
                timer.resume();
                setTimerState(TimerStates.Start);
              }}
            >
              再開
            </button>
          ) : (
            <button disabled={true}>スタート</button>
          )}
          {timerState === TimerStates.Stop ? (
            <button disabled={true}>ストップ</button>
          ) : (
            <button
              onClick={() => {
                setTimerState(TimerStates.Stop);
                setTimer(CountdownTimer.default);
              }}
            >
              ストップ
            </button>
          )}
          {timerState === TimerStates.Start ? (
            <button
              onClick={() => {
                setTimerState(TimerStates.Pause);
                timer.pause();
              }}
            >
              一時停止
            </button>
          ) : (
            <button disabled={true}>一時停止</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
