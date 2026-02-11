const nextButton = document.querySelector('.next-btn');
const heroSection = document.querySelector('.hero-section');
const video = document.querySelector('.hero-video');
const heroMusic = document.querySelector('#hero-music');
const musicToggle = document.querySelector('.music-toggle');
const BASE_VOLUME = 0.35;

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('#mobile-menu-btn');
const navMenu = document.querySelector('#nav-menu');
const navClose = document.querySelector('.nav-close');
const navOverlay = document.querySelector('#nav-overlay');

const toggleMenu = () => {
    navMenu.classList.toggle('active');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
};

const closeMenu = () => {
    navMenu.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
};

mobileMenuBtn.addEventListener('click', toggleMenu);
navClose.addEventListener('click', closeMenu);
navOverlay.addEventListener('click', closeMenu);

// Close menu when clicking on nav items
document.querySelectorAll('.nav-items a').forEach(link => {
    link.addEventListener('click', () => {
        closeMenu();
    });
});

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

heroSection.addEventListener('click', (event) => {
    if (event.target === musicToggle || musicToggle.contains(event.target)) {
        return;
    }
    changeHeroVideo();
});

const updateMusicButton = (isPlaying) => {
    musicToggle.textContent = isPlaying ? 'Pause Music' : 'Play Music';
    musicToggle.setAttribute('aria-pressed', String(isPlaying));
};

let userPaused = false;

const toggleMusic = async (event) => {
    event.stopPropagation();
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

/* Mobile Menu Toggle */
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    const menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });
}

// Scroll Animations using Intersection Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('about-section')) {
                entry.target.classList.add('slide-up');
            } else if (entry.target.classList.contains('info-card')) {
                entry.target.classList.add('slide-up');
            } else if (entry.target.classList.contains('card')) {
                entry.target.classList.add('fade-in');
            } else if (entry.target.classList.contains('contact-section')) {
                entry.target.classList.add('slide-up');
            } else if (entry.target.classList.contains('image-box')) {
                entry.target.classList.add('slide-left');
            } else if (entry.target.classList.contains('info-section')) {
                entry.target.classList.add('slide-up');
            }
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply animations to sections
document.querySelectorAll('.about-section, .info-section, .card, .contact-section, .image-box').forEach(el => {
    if (!el.classList.contains('slide-up') && !el.classList.contains('fade-in') && !el.classList.contains('slide-left')) {
        observer.observe(el);
    }
});
