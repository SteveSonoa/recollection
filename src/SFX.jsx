import React from 'react';
import PropTypes from 'prop-types';

const SFX = ({id, sfxFile}) => (
    <audio id={id}>
        <source src={`/sfx/${sfxFile}`} type='audio/mpeg' />
    </audio>
);

SFX.propTypes = {
    id: PropTypes.string.isRequired,
    sfxFile: PropTypes.string.isRequired,
};

export default SFX;
