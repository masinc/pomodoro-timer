import React, { useEffect, useState } from "react";
import {
  addMilliseconds,
  addMinutes,
  addSeconds,
  format,
  toDate,
} from "date-fns";

const TIME_ZERO = new Date(0);

// const getDefaultTime = () => addMinutes(0, 25);
const getDefaultTime = () => addSeconds(0, 5);
const getZeroTime = () => new Date(0);
const getNow = () => new Date();

export enum CountdownTimerState {
  Play,
  Reset,
  Resume,
  Pause,
}

export type CountdownTimerProps = {
  time?: Date;
  state?: CountdownTimerState;
  onComplete?: () => any;
};

export function CountdownTimer(props: CountdownTimerProps) {
  const [hasRunTimer, setHasRunTimer] = useState(false);
  const [time, setTime] = useState(props.time ?? getDefaultTime());
  const [startTime, setStartTime] = useState<Date | undefined>();
  const [elapsedTime, setElapsedTime] = useState(new Date(time.getTime()));
  const [remainingTime, setRemainingTime] = useState(getZeroTime());
  const [onComplete, setOnComplete] = useState(props.onComplete);

  // onComplete
  useEffect(() => {
    setOnComplete(props.onComplete);
  }, [props]);

  // timer
  useEffect(() => {
    if (!hasRunTimer) {
      return;
    }

    const interval = setInterval(() => {
      if (!startTime) {
        return;
      }
      const currentTime = getNow();
      const elapsedTime = new Date(
        currentTime.getTime() - startTime?.getTime()
      );
      setElapsedTime(toDate(elapsedTime));
      setRemainingTime(new Date(time.getTime() - elapsedTime.getTime()));
    });

    return () => clearInterval(interval);
  }, [hasRunTimer, startTime, time]);

  // props.time
  useEffect(() => {
    if (props.time) {
      setTime(props.time);
    }

    setElapsedTime(toDate(props?.time ?? 0));
    setRemainingTime(props?.time ?? getDefaultTime());
  }, [props.time]);

  // play, reset
  useEffect(() => {
    console.log(props.state);
    if (props.state === CountdownTimerState.Play) {
      setStartTime(getNow());
      setHasRunTimer(true);
      setRemainingTime(toDate(time));
    } else if (props.state === CountdownTimerState.Reset) {
      setStartTime(undefined);
      setHasRunTimer(false);
      setRemainingTime(toDate(time));
    }
  }, [props.state, time]);

  // pause
  useEffect(() => {
    if (props.state === CountdownTimerState.Pause) {
      setStartTime(undefined);
      setHasRunTimer(false);
    }
  }, [props.state]);

  // resume
  useEffect(() => {
    if (props.state === CountdownTimerState.Resume) {
      setStartTime(new Date(getNow().getTime() - elapsedTime.getTime()));
      setHasRunTimer(true);
    }
  }, [props.state, elapsedTime]);

  // complete
  useEffect(() => {
    if (remainingTime.getTime() <= TIME_ZERO.getTime()) {
      setHasRunTimer(false);
      if (onComplete) {
        onComplete();
      }
    }
  }, [remainingTime, onComplete]);

  return (
    <>
      <div>{addMilliseconds(remainingTime, 999).toISOString()}</div>
      <div>{format(addMilliseconds(remainingTime, 999), "mm:ss")}</div>
    </>
  );
}
