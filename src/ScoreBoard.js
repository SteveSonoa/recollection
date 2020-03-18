import React from 'react';
import PropTypes from 'prop-types';

const ScoreBoard = ({score}) => (
    <div
        style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '600px',
            fontWeight: '900',
            color: '#ffffff',
            textShadow:
                '10px 0 #00B7FF, 0 10px #00B7FF, -10px 0  #00B7FF, 0 -10px #00B7FF, 10px 10px #00B7FF, -10px -10px #00B7FF, 10px -10px #00B7FF, -10px 10px #00B7FF',
        }}
    >
        {score}
    </div>
);

ScoreBoard.propTypes = {
    score: PropTypes.number.isRequired,
};

export default ScoreBoard;
