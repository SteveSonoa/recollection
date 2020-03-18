import React from 'react';

const BackgroundVideo = ({video}) => (
    <>
        <div
            className='dark-background'
            style={{
                height: '100vh',
                width: '100vw',
                zIndex: -1,
                position: 'fixed',
                top: '0',
                left: '0',
            }}
        />
        <video id='background-video' autoPlay muted loop>
            <source src={`/${video}`} type='video/mp4' />
        </video>
    </>
);

export default BackgroundVideo;
