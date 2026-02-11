const nextButton = document.querySelector('.next-btn');
const video = document.querySelector('.hero-video');
const heroMusic = document.querySelector('#hero-music');
const musicToggle = document.querySelector('.music-toggle');

const movieList = ['videos/hero-1.mp4',
                   'videos/hero-2.mp4',
                   'videos/hero-3.mp4',
                   'videos/hero-4.mp4',
                   
                ];
    
let index = 0;
nextButton.addEventListener('click', function(){

    index += 1
    video.src= movieList[index];

    if (index === 3){
        index = -1;
    }
});

const updateMusicButton = (isPlaying) => {
    musicToggle.textContent = isPlaying ? 'Pause Music' : 'Play Music';
    musicToggle.setAttribute('aria-pressed', String(isPlaying));
};

const toggleMusic = async () => {
    if (heroMusic.paused) {
        try {
            await heroMusic.play();
            updateMusicButton(true);
        } catch (error) {
            updateMusicButton(false);
        }
    } else {
        heroMusic.pause();
        updateMusicButton(false);
    }
};

musicToggle.addEventListener('click', toggleMusic);
updateMusicButton(false);

window.addEventListener('load', async () => {
    try {
        await heroMusic.play();
        updateMusicButton(true);
    } catch (error) {
        updateMusicButton(false);
    }
});
