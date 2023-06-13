function App() {
  const [displayTime, setDisplayTime] = React.useState(25 * 60);
  const [isDark, setIsDark] = React.useState(false);
  const [breakTime, setBreakTime] = React.useState(5 * 60);
  const [sessionTime, setSessionTime] = React.useState(25 * 60);
  const [timerOn, setTimerOn] = React.useState(false);
  const [onBreak, setOnBreak] = React.useState(false);
  const [isLeft, setIsLeft] = React.useState(true);
  const [visible, setVisible] = React.useState(false);

  const [alertAudio, setAlertAudio] = React.useState(
    new Audio("./breakTime.wav")
  );

  const playAlertSound = () => {
    alertAudio.currentTime = 0;
    alertAudio.play();
  };

  const resetTime = () => {
    setDisplayTime(25 * 60);
    setBreakTime(5 * 60);
    setSessionTime(25 * 60);
  };
  const changeTime = (amount, type) => {
    if (type == "break") {
      if (breakTime <= 0 && amount < 0) return;
      setBreakTime((prev) => prev + amount);
    } else {
      if (sessionTime <= 0 && amount < 0) return;
      setSessionTime((prev) => prev + amount);
      if (!timerOn) {
        setDisplayTime(sessionTime + amount);
      }
    }
  };
  const controlTime = () => {
    let date = new Date();
    let dateTime = date.getTime();
    let second = 1000;

    let nextDate = new Date().getTime() + second;
    let onBreakVariable = onBreak;

    if (!timerOn) {
      let interval = setInterval(() => {
        dateTime = new Date().getTime();

        if (dateTime > nextDate) {
          setDisplayTime((prev) => {
            if (prev <= 0 && !onBreakVariable) {
              playAlertSound();
              onBreakVariable = true;
              setOnBreak(true);
              return breakTime;
            } else if (prev <= 0 && onBreakVariable) {
              playAlertSound();
              onBreakVariable = false;
              setOnBreak(false);
              return sessionTime;
            }
            return prev - 1;
          });
          nextDate += second;
        }
      }, 30);

      localStorage.clear();
      localStorage.setItem("interval-id", interval);
    }
    if (timerOn) {
      clearInterval(localStorage.getItem("interval-id"));
    }
    setTimerOn(!timerOn);
  };
  const formatDisplayTime = (time, type, isLeft) => {
    let hours = Math.floor(time / (60 * 60));
    time -= hours * 60 * 60;
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    let result;
    switch (type) {
      case "hours":
        result = hours;
        break;
      case "minutes":
        result = minutes;
        break;
      case "seconds":
        result = seconds;
        break;
    }

    if (isLeft) {
      result = Math.floor(result / 10);
    } else {
      result = result % 10;
    }
    return result;
  };

  const formatTime = (time) => {
    let hours = Math.floor(time / (60 * 60));
    time -= hours * 60 * 60;
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    let result = hours + ":" + minutes + ":" + seconds;

    return result;
  };

  function PlayButton() {
    return (
      <div>
        <button
          className={
            !isDark ? "btn-large blue-grey darken-1" : "btn-large white"
          }
          style={!isDark ? { color: "#f1f8e9" } : { color: "#263238" }}
          onClick={controlTime}
        >
          {timerOn ? (
            <i className="material-icons">pause_circle_filled</i>
          ) : (
            <i className="material-icons">play_circle_filled</i>
          )}
        </button>
        <button
          className={
            !isDark ? "btn-large blue-grey darken-1" : "btn-large white"
          }
          style={!isDark ? { color: "#f1f8e9" } : { color: "#263238" }}
          onClick={resetTime}
        >
          <i className="material-icons">autorenew</i>
        </button>
      </div>
    );
  }

  function Length({ title, changeTime, type, time, formatTime }) {
    return (
      <div>
        <h3 className="title" style={{ fontSize: "1.5rem" }}>
          {title}
        </h3>
        <div className="time-sets">
          <div
            className={
              !isDark
                ? "btn-medium arrow blue-grey darken-1"
                : "btn-medium arrow white"
            }
            onClick={() => changeTime(-60, type)}
          >
            <i className="material-icons">keyboard_arrow_down</i>
          </div>

          <h3 style={{ fontSize: "1.2rem" }}>{formatTime(time)}</h3>

          <div
            className={
              !isDark
                ? "btn-medium arrow blue-grey darken-1"
                : "btn-medium arrow white"
            }
            onClick={() => changeTime(60, type)}
          >
            <i className="material-icons">keyboard_arrow_up</i>
          </div>
        </div>
      </div>
    );
  }

  function Digit({ time, type, formatDisplayTime }) {
    return (
      <div className="">
        <div className={`flip-clock flip-clock-` + type}>
          <div className="flip-digit">
            <div className="digit digit-left">
              <div
                className={isDark ? "flip-card flip" : "flip-card flip dark"}
              >
                {visible ? (
                  <div className={`top-flip ` + `top-flip-animate`}>
                    {formatDisplayTime(time, type, isLeft)}
                  </div>
                ) : null}

                <div className={isDark ? "top" : "top dark"}>
                  {formatDisplayTime(time, type, isLeft)}
                </div>
                <div className={isDark ? "bottom" : "bottom dark"}>
                  {formatDisplayTime(time, type, isLeft)}
                </div>
                {visible ? (
                  <div className={`bottom-flip ` + `bottom-flip-animate`}>
                    {formatDisplayTime(time, type, isLeft)}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="digit digit-right">
              <div className={isDark ? "flip-card" : "flip-card dark"}>
                {visible ? (
                  <div className={`top-flip ` + `top-flip-animate`}>
                    {formatDisplayTime(time, type, !isLeft)}
                  </div>
                ) : null}
                <div className={isDark ? "top" : "top dark"}>
                  {formatDisplayTime(time, type, !isLeft)}
                </div>
                <div className={isDark ? "bottom" : "bottom dark"}>
                  {formatDisplayTime(time, type, !isLeft)}
                </div>
                {visible ? (
                  <div className={`bottom-flip ` + `bottom-flip-animate`}>
                    {formatDisplayTime(time, type, !isLeft)}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <span className="text">{type}</span>
        </div>
      </div>
    );
  }

  const handleDark = () => {
    setIsDark((current) => !current);
    if (isDark) {
      document.body.style.backgroundColor = "#263238";
      document.body.style.color = "#f1f8e9";
    } else {
      document.body.style.backgroundColor = "#f1f8e9";
      document.body.style.color = "#263238";
    }
  };

  return (
    <div className={isDark ? "container" : "container dark"}>
      <div className={isDark ? "timer" : "timer dark"}>
        <div className="dual-container">
          <Length
            title={"Break"}
            changeTime={changeTime}
            type="break"
            time={breakTime}
            formatTime={formatTime}
          />
          <Length
            title={"Session"}
            changeTime={changeTime}
            type="session"
            time={sessionTime}
            formatTime={formatTime}
          />
        </div>
        <h3 className="main-title" style={{ fontSize: "2rem" }}>
          {onBreak ? "Break" : "Session"}
        </h3>
        <div className={isDark ? "icons" : "icons dark"}>
          <i className="material-icons" onClick={handleDark}>
            {isDark ? "brightness_3" : "wb_sunny"}
          </i>
        </div>
        <div className="clock">
          <Digit
            time={displayTime}
            type={"hours"}
            formatDisplayTime={formatDisplayTime}
          />
          <div className="colon">:</div>
          <Digit
            time={displayTime}
            type={"minutes"}
            formatDisplayTime={formatDisplayTime}
          />
          <div className="colon">:</div>
          <Digit
            time={displayTime}
            type={"seconds"}
            formatDisplayTime={formatDisplayTime}
          />
        </div>
        <div className="btns">
          <PlayButton controlTime={controlTime} />
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
