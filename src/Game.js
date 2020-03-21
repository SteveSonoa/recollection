import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ScoreBoard from './ScoreBoard';
import ExternalPortal from './ExternalPortal';
import BackgroundVideo from './BackgroundVideo';
import SFX from './SFX';
import PlayerInfo from './PlayerInfo';
import CountdownTimer from './CountdownTimer';

/** TODO LIST
 * Add new sfx for timer tick when it reaches 5 seconds or less
 * Add sfx for when timer ends (cheers for high score, disappointed "oh" for low score)
 * Add sfx for when score appears
 * Add sfx for when score moves underneath name (when the round resets)
 * Add bkgnd for player info container
 * Add bkgnd for player info areas (name, round scores, total score)
 * Break sections into components
 */

class Game extends Component {
    constructor() {
        super();
        this.state = {
            allScores: [],
            backgroundVideo: 'checkerboard_background.mp4',
            currentRound: 1,
            isNumberVisible: false,
            isPlaying: false,
            isPortalVisible: false,
            isScoreVisible: false,
            name: '',
            nameSize: 120,
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
            this.setState({
                score: score - 1,
            });
            this.losePointSfx.pause();
            this.losePointSfx.currentTime = 0.0;
            this.losePointSfx.play();
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

    updateScoreboard = () => {
        const {isPlaying, score, currentRound} = this.state;

        if (!isPlaying) {
            const allScores = [...this.state.allScores, score];
            this.setState({
                allScores,
                currentRound: currentRound + 1,
            });

            this.toggleScoreVisibility();
            this.resetScore();
        }
    };

    handleChange = e => {
        const {name, value} = e.target;
        console.log(name, value);
        this.setState({
            [name]: value,
        });
    };

    increaseNameSize = () => {
        this.setState({
            nameSize: this.state.nameSize + 8,
        });
    };

    decreaseNameSize = () => {
        this.setState({
            nameSize: this.state.nameSize - 8,
        });
    };

    render() {
        const {
            backgroundVideo,
            isNumberVisible,
            isPlaying,
            isPortalVisible,
            score,
            secondsLeft,
        } = this.state;

        const buttonStyle = {
            fontSize: '18px',
            padding: '5px 15px',
            margin: '5px',
        };

        return (
            <div className='game-container'>
                <BackgroundVideo video={backgroundVideo} />
                <SFX id='correct-answer' sfxFile='correct.mp3' />
                <SFX id='lose-point' sfxFile='wrong.mp3' />
                <SFX id='fill-timer' sfxFile='Magic_Chime.mp3' />
                <SFX id='clock-tick' sfxFile='tick.mp3' />

                <CountdownTimer
                    activatePortal={e => {
                        this.togglePortal();
                        setTimeout(() => {
                            this.setState({});
                        }, 1000);
                    }}
                    isNumberVisible={isNumberVisible}
                    secondsLeft={secondsLeft}
                />

                <div
                    style={{
                        width: '100vw',
                        height: 'calc(100vh - 200px',
                    }}
                >
                    <div className='left-side'>
                        <PlayerInfo
                            name={this.state.name}
                            nameSize={this.state.nameSize}
                            scores={this.state.allScores}
                            handleChange={this.handleChange}
                        />
                    </div>
                    <div
                        className='right-side'
                        style={{width: '50vw', height: '100%', float: 'left'}}
                    >
                        {this.state.isScoreVisible && (
                            <ScoreBoard score={score} />
                        )}
                    </div>
                </div>

                {isPortalVisible && (
                    <ExternalPortal>
                        <div className='portal-sections'>
                            <div>
                                <button
                                    style={buttonStyle}
                                    onClick={() => this.addTime()}
                                >
                                    Fill The Timer
                                </button>
                                <button
                                    style={{
                                        ...buttonStyle,
                                        cursor: isPlaying
                                            ? 'not-allowed'
                                            : 'pointer',
                                    }}
                                    onClick={this.toggleScoreVisibility}
                                    disabled={this.isPlaying}
                                >
                                    {this.state.isScoreVisible
                                        ? 'Hide'
                                        : 'Show'}{' '}
                                    Score
                                </button>
                                <button
                                    style={buttonStyle}
                                    onClick={this.startTimer}
                                >
                                    Start!
                                </button>
                            </div>
                            <div>
                                <button
                                    style={buttonStyle}
                                    onClick={this.addToScore}
                                >
                                    Add Point
                                </button>
                                <button
                                    style={buttonStyle}
                                    onClick={this.subtractFromScore}
                                >
                                    Remove Point
                                </button>
                            </div>
                            <div>
                                <button
                                    style={buttonStyle}
                                    onClick={e => this.addToScore(e, true)}
                                >
                                    Add Point After Timer Ends
                                </button>
                                <button
                                    style={buttonStyle}
                                    onClick={this.updateScoreboard}
                                >
                                    Start New Round
                                </button>
                            </div>
                            <div>
                                <input
                                    type='text'
                                    name='name'
                                    value={this.state.name}
                                    onChange={e => this.handleChange(e)}
                                    placeholder='Player Name'
                                    style={buttonStyle}
                                />
                            </div>
                            <div>
                                <button
                                    style={buttonStyle}
                                    onClick={this.decreaseNameSize}
                                >
                                    Smaller Name
                                </button>
                                <button
                                    style={buttonStyle}
                                    onClick={this.increaseNameSize}
                                >
                                    Larger Name
                                </button>
                            </div>
                            <p style={buttonStyle}>
                                You are {!isPlaying && 'not'} playing.
                            </p>
                            <p style={buttonStyle}>
                                You are on round {this.state.currentRound}.
                            </p>
                        </div>
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
