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
            fontSize: '400px',
            fontWeight: '900',
        }}
    >
        {score}
    </div>
);

ScoreBoard.propTypes = {
    score: PropTypes.number.isRequired,
};

export default ScoreBoard;
