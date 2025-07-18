// biome-ignore lint/style/useImportType: react required for tsx compatibility
import React, { useCallback, useRef, useState } from "react";
import ReactDOM from "react-dom";

const formattedSeconds = (sec: number) =>
    `${Math.floor(sec / 60)}:${`0${sec % 60}`.slice(-2)}`;

interface StopwatchProps {
    initialSeconds: number;
}

const Stopwatch: React.FC<StopwatchProps> = ({ initialSeconds }) => {
    const [secondsElapsed, setSecondsElapsed] = useState(initialSeconds);
    const [lastClearedIncrementer, setLastClearedIncrementer] = useState<
        number | null
    >(null);
    const [laps, setLaps] = useState<number[]>([]);

    const incrementerRef = useRef<number | null>(null);

    const handleIncrement = () => {
        setSecondsElapsed((prev) => prev + 1);
    };

    const handleStartClick = () => {
        incrementerRef.current = setInterval(handleIncrement, 1000);
    };

    const handleStopClick = () => {
        if (incrementerRef.current) {
            setLastClearedIncrementer(incrementerRef.current);
            clearInterval(incrementerRef.current);
        }
    };

    const handleResetClick = () => {
        if (incrementerRef.current) {
            clearInterval(incrementerRef.current);
            incrementerRef.current = null;
        }
        setSecondsElapsed(0);
        setLaps([]);
    };

    const handleLapClick = useCallback(() => {
        setLaps((prevLaps) => [...prevLaps, secondsElapsed]);
    }, [secondsElapsed]);

    const handleDeleteClick = (index: number) => {
        return () => {
            setLaps((prevLaps) => prevLaps.filter((_, i) => i !== index));
        };
    };

    return (
        <div className="stopwatch">
            <h1 className="stopwatch-timer">{formattedSeconds(secondsElapsed)}</h1>
            {secondsElapsed === 0 ||
                incrementerRef.current === lastClearedIncrementer ? (
                <button type="button" className="start-btn" onClick={handleStartClick}>
                    start
                </button>
            ) : (
                <button type="button" className="stop-btn" onClick={handleStopClick}>
                    stop
                </button>
            )}
            {secondsElapsed !== 0 &&
                incrementerRef.current !== lastClearedIncrementer ? (
                <button type="button" onClick={handleLapClick}>
                    lap
                </button>
            ) : null}
            {secondsElapsed !== 0 &&
                incrementerRef.current === lastClearedIncrementer ? (
                <button type="button" onClick={handleResetClick}>
                    reset
                </button>
            ) : null}
            <div className="stopwatch-laps">
                {laps?.length
                    ? laps.map((lap, i) => (
                        <Lap
                            key={`lap-${i}-${lap}`}
                            index={i}
                            lap={lap}
                            onDelete={handleDeleteClick(i)}
                        />
                    ))
                    : null}
            </div>
        </div>
    );
};

const Lap: React.FC<{
    index: number;
    lap: number;
    onDelete: (index: number) => void;
}> = ({ index, lap, onDelete }) => (
    <div key={index} className="stopwatch-lap">
        <strong>{index}</strong>/ {formattedSeconds(lap)}{" "}
        <button type="button" onClick={() => onDelete(index)}>
            {" X "}
        </button>
    </div>
);

ReactDOM.render(
    <Stopwatch initialSeconds={0} />,
    document.getElementById("root"),
);
