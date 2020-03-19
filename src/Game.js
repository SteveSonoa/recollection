import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ScoreBoard from './ScoreBoard';
import ExternalPortal from './ExternalPortal';
import BackgroundVideo from './BackgroundVideo';
import SFX from './SFX';

class Game extends Component {
    constructor() {
        super();
        this.state = {
            backgroundVideo: 'checkerboard_background.mp4',
            isNumberVisible: false,
            isPlaying: false,
            isPortalVisible: false,
            isScoreVisible: false,
            score: 0,
            secondsLeft: 0,
        };
        this.timer = 0;
    }

    componentDidMount = () => {
        window.addEventListener('beforeunload', () => {
            this.togglePortal(false);
        });
        this.setTimerSfx = document.getElementById('fill-timer');
        this.losePointSfx = document.getElementById('lose-point');
        this.gainPointSfx = document.getElementById('correct-answer');
        this.clockTickSfx = document.getElementById('clock-tick');
    };

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    addTime = () => {
        if (!this.state.isPlaying) {
            this.setState({
                secondsLeft: this.props.timeAllowed,
            });
            this.setTimerSfx.play();

            setTimeout(() => {
                this.setState({
                    isNumberVisible: true,
                });
            }, 1500);
        }
    };

    countDown = () => {
        // Remove one second, set state so a re-render happens.
        let secondsLeft = this.state.secondsLeft - 1;
        this.setState({
            secondsLeft: secondsLeft,
        });
        this.clockTickSfx.play();

        // Check if we're at zero.
        if (secondsLeft === 0) {
            clearInterval(this.timer);
            this.setState({
                isPlaying: false,
            });
            setTimeout(() => {
                this.setState({
                    isNumberVisible: false,
                });
            }, 1500);
            this.timer = 0;
        }
    };

    startTimer = () => {
        const {isPlaying, secondsLeft, isNumberVisible} = this.state;
        if (
            this.timer === 0 &&
            !isPlaying &&
            secondsLeft === 60 &&
            isNumberVisible
        ) {
            this.setState({
                isPlaying: true,
                isScoreVisible: true,
            });
            this.timer = setInterval(this.countDown, 1000);
        }
    };

    resetScore = () => {
        this.setState({
            score: 0,
        });
    };

    addToScore = (_, isOkayToAdd = this.state.isPlaying) => {
        if (isOkayToAdd) {
            this.setState({
                score: this.state.score + 1,
            });
            this.gainPointSfx.pause();
            this.gainPointSfx.currentTime = 0.0;
            this.gainPointSfx.play();
        }
    };

    subtractFromScore = () => {
        const {score} = this.state;

        if (score > 0) {
            this.losePointSfx.play();
            this.setState({
                score: score - 1,
            });
        }
    };

    togglePortal = (newValue = null) => {
        this.setState({
            isPortalVisible:
                typeof newValue === 'boolean'
                    ? newValue
                    : !this.state.isPortalVisible,
        });
    };

    toggleScoreVisibility = () => {
        const {isPlaying, isScoreVisible} = this.state;

        if (!isPlaying) {
            this.setState({
                isScoreVisible: !isScoreVisible,
            });
        }
    };

    hackPortal = () => {
        this.setState({});
    };

    setupPortal = () => {};

    render() {
        const {
            backgroundVideo,
            isNumberVisible,
            isPlaying,
            isPortalVisible,
            score,
            secondsLeft,
        } = this.state;
        const {timeAllowed} = this.props;

        const calculatePercent = () =>
            ((secondsLeft / timeAllowed) * 100).toFixed(3);
        const calculateRadius = () =>
            secondsLeft * Math.floor(360 / timeAllowed);
        const imageWidth = 200;

        const buttonStyle = {
            fontSize: '18px',
            padding: '5px 15px',
        };

        return (
            <div className='game-container'>
                <BackgroundVideo video={backgroundVideo} />
                <SFX id='correct-answer' sfxFile='correct.mp3' />
                <SFX id='lose-point' sfxFile='wrong.mp3' />
                <SFX id='fill-timer' sfxFile='Magic_Chime.mp3' />
                <SFX id='clock-tick' sfxFile='tick.mp3' />
                <div
                    style={{
                        position: 'relative',
                        height: '200px',
                        width: '100vw',
                        overflow: 'hidden',
                        cursor: 'pointer',
                    }}
                    onClick={e => {
                        this.togglePortal();
                        setTimeout(() => {
                            this.setState({});
                        }, 1000);
                    }}
                >
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
                        {isNumberVisible ? secondsLeft : ''}
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

                <div
                    style={{
                        width: '100vw',
                        height: 'calc(100vh - 200px',
                    }}
                >
                    <div
                        style={{
                            width: '50vw',
                            height: '100%',
                            float: 'left',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    />
                    <div style={{width: '50vw', height: '100%', float: 'left'}}>
                        {this.state.isScoreVisible && (
                            <ScoreBoard score={score} />
                        )}
                    </div>
                </div>

                {isPortalVisible && (
                    <ExternalPortal>
                        <button
                            style={buttonStyle}
                            onClick={() => this.addTime()}
                        >
                            Fill The Timer
                        </button>
                        <button style={buttonStyle} onClick={this.startTimer}>
                            Start!
                        </button>
                        <button style={buttonStyle} onClick={this.resetScore}>
                            Reset Score
                        </button>
                        <button style={buttonStyle} onClick={this.addToScore}>
                            Add Point
                        </button>
                        <button
                            style={buttonStyle}
                            onClick={e => this.addToScore(e, true)}
                        >
                            Add Point After Timer Ends
                        </button>
                        <button
                            style={buttonStyle}
                            onClick={this.subtractFromScore}
                        >
                            Remove Point
                        </button>
                        <button
                            style={{
                                ...buttonStyle,
                                cursor: isPlaying ? 'not-allowed' : 'pointer',
                            }}
                            onClick={this.toggleScoreVisibility}
                            disabled={this.isPlaying}
                        >
                            {this.state.isScoreVisible ? 'Hide' : 'Show'} Score
                        </button>
                        <p>You are {!isPlaying && 'not'} playing.</p>
                    </ExternalPortal>
                )}
            </div>
        );
    }
}

Game.propTypes = {
    timeAllowed: PropTypes.number,
};

Game.defaultProps = {
    timeAllowed: 60,
};

export default Game;
