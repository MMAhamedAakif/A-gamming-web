const nextButton = document.querySelector('.next-btn');
const heroSection = document.querySelector('.hero-section');
const video = document.querySelector('.hero-video');
const heroMusic = document.querySelector('#hero-music');
const musicToggle = document.querySelector('.music-toggle');
const BASE_VOLUME = 0.35;

const movieList = ['videos/hero-1.mp4',
                   'videos/hero-2.mp4',
                   'videos/hero-3.mp4',
                   'videos/hero-4.mp4',
                   
                ];

const audioList = [
    'audio/hero-02.mp3',
    'audio/hero-01.mp3',
    'audio/hero-03.mp3',
    'audio/hero-04.mp3',
];
    
let index = 0;
const changeHeroVideo = () => {

    index += 1
    video.src= movieList[index];

    const audioIndex = index % audioList.length;
    heroMusic.src = audioList[audioIndex];

    if (index === 3){
        index = -1;
    }
};

nextButton.addEventListener('click', (event) => {
    event.stopPropagation();
    changeHeroVideo();
});

heroSection.addEventListener('click', () => {
    changeHeroVideo();
});

const updateMusicButton = (isPlaying) => {
    musicToggle.textContent = isPlaying ? 'Pause Music' : 'Play Music';
    musicToggle.setAttribute('aria-pressed', String(isPlaying));
};

let userPaused = false;

const toggleMusic = async () => {
    if (heroMusic.paused) {
        try {
            await heroMusic.play();
            userPaused = false;
            updateMusicButton(true);
        } catch (error) {
            updateMusicButton(false);
        }
    } else {
        heroMusic.pause();
        userPaused = true;
        updateMusicButton(false);
    }
};

musicToggle.addEventListener('click', toggleMusic);
updateMusicButton(false);

window.addEventListener('load', async () => {
    try {
        heroMusic.src = audioList[0];
        heroMusic.volume = BASE_VOLUME;
        await heroMusic.play();
        updateMusicButton(true);
    } catch (error) {
        updateMusicButton(false);
    }
});

let isTicking = false;
const handleScrollFade = () => {
    if (!heroMusic || !heroSection) {
        return;
    }

    const heroHeight = heroSection.offsetHeight;
    if (heroHeight <= 0) {
        return;
    }

    const scrollY = window.scrollY;
    const progress = Math.min(Math.max(scrollY / heroHeight, 0), 1);
    const volume = Math.max(0, BASE_VOLUME * (1 - progress));
    heroMusic.volume = volume;

    if (progress >= 1 && !heroMusic.paused) {
        heroMusic.pause();
        if (!userPaused) {
            updateMusicButton(false);
        }
    }

    if (progress < 1 && heroMusic.paused && !userPaused && volume > 0) {
        heroMusic.play().then(() => {
            updateMusicButton(true);
        }).catch(() => {
            updateMusicButton(false);
        });
    }
};

window.addEventListener('scroll', () => {
    if (!isTicking) {
        window.requestAnimationFrame(() => {
            handleScrollFade();
            isTicking = false;
        });
        isTicking = true;
    }
});
