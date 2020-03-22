import React from "react";
import PropTypes from "prop-types";

const ScoreBoard = ({ score }) => <div className="scoreboard">{score}</div>;

ScoreBoard.propTypes = {
    score: PropTypes.number.isRequired
};

export default ScoreBoard;
