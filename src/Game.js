import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';

const Game = ({timeAllowed}) => {
    const [timer, setTimer] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isNumberVisible, setIsNumberVisible] = useState(false);

    const addTime = () => {
        if (!isPlaying) {
            setTimer(timeAllowed);
            setTimeout(() => {
                setIsNumberVisible(true);
            }, 1500);
        }
    };

    const startTimer = () => {
        if (!isPlaying && timer === 60 && isNumberVisible) {
            setIsPlaying(true);
        }
    };

    useEffect(() => {
        let interval = null;
        if (isPlaying && timer >= 0) {
            interval = setInterval(() => {
                setTimer(timer => timer - 1);
            }, 1000);
        } else if (isPlaying && timer < 0) {
            setTimer(0);
            setIsPlaying(false);
            setTimeout(() => {
                setIsNumberVisible(false);
            }, 1500);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isPlaying, timer]);

    const calculatePercent = () => ((timer / timeAllowed) * 100).toFixed(3);
    const calculateRadius = () => timer * Math.floor(360 / timeAllowed);
    const imageWidth = 200;

    return (
        <div className='game-container'>
            <button onClick={addTime}>Fill The Timer</button>
            <button onClick={startTimer}>Start!</button>
            <div style={{position: 'relative'}}>
                <img
                    src='/stopwatch_logo.png'
                    alt='60 Second Recollection'
                    style={{
                        width: `${imageWidth}px`,
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        zIndex: '2',
                    }}
                />
                <div
                    className='clock-hand'
                    style={{
                        borderRadius: '50%',
                        height: '150px',
                        width: '150px',
                        transform: `rotate(${calculateRadius()}deg)`,
                        textAlign: 'center',
                        transition: 'transform 1s linear',
                        zIndex: '3',
                        position: 'absolute',
                        top: '29px',
                        left: '29px',
                        fontSize: '60px',
                        fontWeight: '900',
                        color: '#FFD280',
                    }}
                >
                    |
                </div>
                <h1
                    style={{
                        position: 'absolute',
                        top: '31px',
                        left: '5px',
                        textAlign: 'center',
                        color: '#652C90',
                        zIndex: '4',
                        fontSize: '120px',
                        margin: '0',
                        width: `${imageWidth}px`,
                        textShadow: '0 0 10px #ffffff',
                    }}
                >
                    {isNumberVisible ? timer : ''}
                </h1>
                <img
                    src='/title_words.png'
                    alt='60 Second Recollection'
                    style={{
                        height: `calc(${imageWidth / 2}px - ${imageWidth /
                            20}px)`,
                        position: 'absolute',
                        top: `calc(${imageWidth / 4}px + 15px)`,
                        left: '50%',
                        zIndex: '2',
                        transform: 'translateX(-50%)',
                    }}
                />
                <div
                    style={{
                        width: `calc(100% - ${imageWidth * 0.75}px + 50px)`,
                        position: 'absolute',
                        top: `${imageWidth / 4}px`,
                        left: `${imageWidth * 0.75}px`,
                        height: `${imageWidth / 2}px`,
                    }}
                >
                    <div
                        className='timer'
                        style={{
                            background: '#F46938',
                            width: `${calculatePercent()}%`,
                            transition: 'width 1s linear',
                            color: '#ffffff',
                            textAlign: 'left',
                            padding: '10px 0',
                            height: '100%',
                            boxShadow: '3px 3px 5px rgba(0, 0, 0, 0.5)',
                            borderRadius: '0 50px 50px 0',
                        }}
                    />
                </div>
            </div>

            <p>You are {!isPlaying && 'not'} playing.</p>
        </div>
    );
};

Game.propTypes = {
    timeAllowed: PropTypes.number,
};

Game.defaultProps = {
    timeAllowed: 60,
};

export default Game;
