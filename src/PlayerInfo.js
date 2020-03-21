import React from 'react';
import PropTypes from 'prop-types';

const PlayerInfo = ({handleChange, name, nameSize, scores}) => (
    <div className='player-info-container'>
        <div id='player-name' style={{fontSize: `${nameSize}px`}}>
            {name}
        </div>
        <div id='player-scores'>
            <div>{isNaN(scores[0]) ? '' : scores[0]}</div>
            <div>{isNaN(scores[1]) ? '' : scores[1]}</div>
            <div>{isNaN(scores[2]) ? '' : scores[2]}</div>
        </div>
        <div id='total-score'>
            {isNaN(scores[0])
                ? ''
                : scores.reduce((score, total) => score + total, 0)}
        </div>
    </div>
);

PlayerInfo.propTypes = {
    handleChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    nameSize: PropTypes.number,
    scores: PropTypes.arrayOf(PropTypes.number).isRequired,
};

PlayerInfo.defaultProps = {
    nameSize: 120,
};

export default PlayerInfo;
