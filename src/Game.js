import React, { Component } from "react";
import PropTypes from "prop-types";
import ScoreBoard from "./ScoreBoard";
import ExternalPortal from "./ExternalPortal";
import BackgroundVideo from "./BackgroundVideo";
import SFX from "./SFX";
import PlayerInfo from "./PlayerInfo";
import CountdownTimer from "./CountdownTimer";

class Game extends Component {
    constructor() {
        super();
        this.state = {
            allScores: [],
            backgroundVideo: "checkerboard_background.mp4",
            currentRound: 1,
            isNumberVisible: false,
            isMusicPlaying: false,
            isPlaying: false,
            isPortalVisible: false,
            isScoreVisible: false,
            name: "",
            nameSize: 120,
            score: 0,
            secondsLeft: 0
        };
        this.timer = 0;
    }

    componentDidMount = () => {
        window.addEventListener("beforeunload", () => {
            this.togglePortal(false);
        });
        this.setTimerSfx = document.getElementById("fill-timer");
        this.losePointSfx = document.getElementById("lose-point");
        this.gainPointSfx = document.getElementById("correct-answer");
        this.clockTickSfx = document.getElementById("clock-tick");
        this.applauseSfx = document.getElementById("applause");
        this.finalClockTickSfx = document.getElementById("final-tick");
        this.cheersSfx = document.getElementById("kids-cheering");
        this.buzzerSfx = document.getElementById("buzzer");
        this.showScoreSfx = document.getElementById("show-score");
        this.addToTotalSfx = document.getElementById("add-to-total");
        this.babyLaughSfx = document.getElementById("baby-laugh");
        this.music = document.getElementById("music");
    };

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    resetGame = () => {
        this.setState({
            allScores: [],
            currentRound: 1,
            isNumberVisible: false,
            isMusicPlaying: false,
            isPlaying: false,
            isScoreVisible: false,
            name: "",
            nameSize: 120,
            score: 0,
            secondsLeft: 0
        });
        clearInterval(this.timer);
        this.timer = 0;
        this.music.pause();
        this.music.currentTime = 0.0;
    };

    addTime = () => {
        if (!this.state.isPlaying) {
            this.setState({
                secondsLeft: this.props.timeAllowed
            });
            this.setTimerSfx.play();

            setTimeout(() => {
                this.setState({
                    isNumberVisible: true
                });
            }, 1500);
        }
    };

    countDown = () => {
        // Remove one second, set state so a re-render happens.
        let secondsLeft = this.state.secondsLeft - 1;
        this.setState({
            secondsLeft: secondsLeft
        });
        if (secondsLeft > 5) {
            this.clockTickSfx.play();
        } else if (secondsLeft > 0) {
            this.finalClockTickSfx.play();
        }

        // Check if we're at zero.
        if (secondsLeft === 0) {
            this.playGameEndingBuzzer();
            clearInterval(this.timer);
            this.setState({
                isPlaying: false
            });
            setTimeout(() => {
                this.setState({
                    isNumberVisible: false
                });
            }, 1500);
            this.timer = 0;
            setTimeout(() => {
                if (this.state.score >= 20) {
                    this.cheersSfx.play();
                } else if (this.state.score >= 5) {
                    this.applauseSfx.play();
                } else {
                    this.babyLaughSfx.play();
                }
            }, 500);
        }
    };

    startTimer = () => {
        const { isPlaying, secondsLeft, isNumberVisible } = this.state;
        if (
            this.timer === 0 &&
            !isPlaying &&
            secondsLeft === 60 &&
            isNumberVisible
        ) {
            this.setState({
                isPlaying: true,
                isScoreVisible: true
            });
            this.timer = setInterval(this.countDown, 1000);
        }
    };

    resetScore = () => {
        this.setState({
            score: 0
        });
    };

    addToScore = (_, isOkayToAdd = this.state.isPlaying) => {
        if (isOkayToAdd) {
            this.setState({
                score: this.state.score + 1
            });
            this.gainPointSfx.pause();
            this.gainPointSfx.currentTime = 0.0;
            this.gainPointSfx.play();
        }
    };

    subtractFromScore = () => {
        const { score } = this.state;

        if (score > 0) {
            this.setState({
                score: score - 1
            });
            this.losePointSfx.pause();
            this.losePointSfx.currentTime = 0.0;
            this.losePointSfx.play();
        }
    };

    togglePortal = (newValue = null) => {
        this.setState({
            isPortalVisible:
                typeof newValue === "boolean"
                    ? newValue
                    : !this.state.isPortalVisible
        });
    };

    toggleScoreVisibility = () => {
        const { isPlaying, isScoreVisible } = this.state;

        if (!isPlaying) {
            if (!isScoreVisible) this.showScoreSfx.play();
            this.setState({
                isScoreVisible: !isScoreVisible
            });
        }
    };

    updateScoreboard = () => {
        const { isPlaying, score, currentRound } = this.state;

        if (!isPlaying) {
            const allScores = [...this.state.allScores, score];
            this.setState({
                allScores,
                currentRound: currentRound + 1
            });

            this.toggleScoreVisibility();
            this.resetScore();
            this.addToTotalSfx.play();
        }
    };

    handleChange = e => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    };

    increaseNameSize = () => {
        this.setState({
            nameSize: this.state.nameSize + 8
        });
    };

    decreaseNameSize = () => {
        this.setState({
            nameSize: this.state.nameSize - 8
        });
    };

    playGameEndingBuzzer = () => {
        this.buzzerSfx.play();
        setTimeout(() => {
            this.buzzerSfx.pause();
            this.buzzerSfx.currentTime = 0.0;
        }, 1000);
    };

    playApplauseSfx = () => {
        this.applauseSfx.play();
    };

    playCheeringSfx = () => {
        this.cheersSfx.play();
    };

    toggleMusicTest = () => {
        if (this.state.isMusicPlaying) {
            this.setState({
                isMusicPlaying: false
            });

            setTimeout(() => {
                this.music.pause();
            }, 1000);
        } else {
            this.setState({
                isMusicPlaying: true
            });

            this.music.play();
        }
    };

    toggleMusic = () => {
        const delay = 100;

        if (this.state.isMusicPlaying) {
            this.setState({
                isMusicPlaying: false
            });

            const fadeOut = setInterval(() => {
                if (this.music.volume > 0) {
                    this.music.volume = parseFloat(
                        (this.music.volume - 0.1).toFixed(1)
                    );
                } else {
                    this.music.pause();
                    clearInterval(fadeOut);
                }
            }, delay);
        } else {
            this.setState({
                isMusicPlaying: true
            });

            this.music.play();
            const fadeIn = setInterval(() => {
                if (this.music.volume < 1) {
                    this.music.volume = parseFloat(
                        (this.music.volume + 0.1).toFixed(1)
                    );
                } else {
                    clearInterval(fadeIn);
                }
            }, delay);
        }
    };

    render() {
        const {
            backgroundVideo,
            isNumberVisible,
            isPlaying,
            isPortalVisible,
            score,
            secondsLeft
        } = this.state;

        const buttonStyle = {
            fontSize: "18px",
            padding: "5px 15px",
            margin: "5px"
        };

        return (
            <div className="game-container">
                <BackgroundVideo video={backgroundVideo} />
                <SFX id="correct-answer" sfxFile="correct.mp3" />
                <SFX id="lose-point" sfxFile="wrong.mp3" />
                <SFX id="fill-timer" sfxFile="Magic_Chime.mp3" />
                <SFX id="clock-tick" sfxFile="tick.mp3" />
                <SFX id="applause" sfxFile="applause.mp3" />
                <SFX id="final-tick" sfxFile="final-tick-2.mp3" />
                <SFX id="kids-cheering" sfxFile="kids_cheering.mp3" />
                <SFX id="buzzer" sfxFile="long-game-show-buzzer.mp3" />
                <SFX id="show-score" sfxFile="tick-1.mp3" />
                <SFX id="add-to-total" sfxFile="Stomach_Thumps.mp3" />
                <SFX id="baby-laugh" sfxFile="babies-laughing.mp3" />
                <SFX id="music" sfxFile="Maple-Leaf-Rag-10m51s.mp3" />

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
                        width: "100vw",
                        height: "calc(100vh - 200px"
                    }}
                >
                    <div className="left-side">
                        <PlayerInfo
                            name={this.state.name}
                            nameSize={this.state.nameSize}
                            scores={this.state.allScores}
                            handleChange={this.handleChange}
                        />
                    </div>
                    <div
                        className="right-side"
                        // style={{ width: "50vw", height: "100%", float: "left" }}
                    >
                        {this.state.isScoreVisible && (
                            <ScoreBoard score={score} />
                        )}
                    </div>
                </div>

                {isPortalVisible && (
                    <ExternalPortal>
                        <div className="portal-sections">
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
                                            ? "not-allowed"
                                            : "pointer"
                                    }}
                                    onClick={this.toggleScoreVisibility}
                                    disabled={this.isPlaying}
                                >
                                    {this.state.isScoreVisible
                                        ? "Hide"
                                        : "Show"}{" "}
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
                                    type="text"
                                    name="name"
                                    value={this.state.name}
                                    onChange={e => this.handleChange(e)}
                                    placeholder="Player Name"
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
                                You are {!isPlaying && "not"} playing.
                            </p>
                            <p style={buttonStyle}>
                                You are on round {this.state.currentRound}.
                            </p>
                            <div>
                                <button
                                    style={buttonStyle}
                                    onClick={this.setTimerToTen}
                                >
                                    Set Timer To 10
                                </button>
                                <button
                                    style={buttonStyle}
                                    onClick={this.playApplauseSfx}
                                >
                                    Applause
                                </button>
                                <button
                                    style={buttonStyle}
                                    onClick={this.playCheeringSfx}
                                >
                                    Cheering
                                </button>
                                <button
                                    style={buttonStyle}
                                    onClick={this.toggleMusic}
                                >
                                    Toggle Music
                                </button>
                            </div>
                            <div>
                                <button
                                    style={buttonStyle}
                                    onClick={this.resetGame}
                                >
                                    RESET GAME
                                </button>
                            </div>
                        </div>
                    </ExternalPortal>
                )}
            </div>
        );
    }
}

Game.propTypes = {
    timeAllowed: PropTypes.number
};

Game.defaultProps = {
    timeAllowed: 60
};

export default Game;
