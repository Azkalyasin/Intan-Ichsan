document.addEventListener('DOMContentLoaded', () => {

    // ─── CONSTANTS ────────────────────────────────────────────────
    // To adjust slide transition speed, change SLIDE_DURATION (ms).
    // The CSS transition values (opacity, transform, filter) also need to match.
    const SLIDE_DURATION = 6000; // 6 seconds per slide
    const TOTAL_SLIDES = 7;      // Number of slides (slide1 → slide7)
    const MAPS_SLIDE_INDEX = 4;  // 0-based index of slide 5

    // ─── ELEMENTS ─────────────────────────────────────────────────
    const starsContainerEl = document.getElementById('stars-container');
    const openBtn          = document.getElementById('openBtn');
    const heartIcon        = document.getElementById('heartIcon');
    const heartWrapper     = document.getElementById('heartWrapper');
    const sliderContainer  = document.getElementById('sliderContainer');
    const bgAudio          = document.getElementById('bg-audio');
    const openingScreen    = document.getElementById('openingScreen');
    const prevBtn          = document.getElementById('prevBtn');
    const nextBtn          = document.getElementById('nextBtn');
    const mapsBtn          = document.getElementById('mapsBtn');
    const musicBtn         = document.getElementById('musicBtn');
    const musicIconOn      = document.getElementById('musicIconOn');
    const musicIconOff     = document.getElementById('musicIconOff');

    // ─── STARS ────────────────────────────────────────────────────
    const starCount = 150;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top  = `${Math.random() * 100}%`;
        const size = Math.random() * 2 + 1;
        star.style.width  = `${size}px`;
        star.style.height = `${size}px`;
        star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
        star.style.animationDelay = `${Math.random() * 5}s`;
        starsContainerEl.appendChild(star);
    }

    // ─── SLIDE STATE ──────────────────────────────────────────────
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    let slideTimer;
    let isPlaying = true; // audio state

    function updateNavButtons() {
        // Hide prev on first slide, hide next on last slide
        if (currentSlide === 0) {
            prevBtn.classList.add('hidden');
        } else {
            prevBtn.classList.remove('hidden');
        }

        if (currentSlide === TOTAL_SLIDES - 1) {
            nextBtn.classList.add('hidden');
        } else {
            nextBtn.classList.remove('hidden');
        }

        // Show maps button only on slide 5 (index 4)
        if (currentSlide === MAPS_SLIDE_INDEX) {
            mapsBtn.classList.add('show');
        } else {
            mapsBtn.classList.remove('show');
        }
    }

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        updateNavButtons();
    }

    function goNext() {
        if (currentSlide < TOTAL_SLIDES - 1) {
            goToSlide(currentSlide + 1);
        }
    }

    function goPrev() {
        if (currentSlide > 0) {
            goToSlide(currentSlide - 1);
        }
    }

    // ─── MUSIC CONTROL ────────────────────────────────────────────
    function setMusicState(playing) {
        isPlaying = playing;
        if (playing) {
            bgAudio.play().catch(e => console.log('Audio play failed:', e));
            musicIconOn.classList.remove('hidden');
            musicIconOff.classList.add('hidden');
            musicBtn.classList.add('playing');
        } else {
            bgAudio.pause();
            musicIconOn.classList.add('hidden');
            musicIconOff.classList.remove('hidden');
            musicBtn.classList.remove('playing');
        }
    }

    musicBtn.addEventListener('click', () => {
        setMusicState(!isPlaying);
    });

    // ─── PAUSE ON TAB HIDE / PAGE BLUR ────────────────────────────
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            bgAudio.pause();
        } else {
            if (isPlaying) {
                bgAudio.play().catch(e => console.log('Audio resume failed:', e));
            }
        }
    });

    window.addEventListener('blur', () => {
        bgAudio.pause();
    });

    window.addEventListener('focus', () => {
        if (isPlaying) {
            bgAudio.play().catch(e => console.log('Audio focus-resume failed:', e));
        }
    });

    // ─── OPENING ANIMATION ────────────────────────────────────────
    openBtn.addEventListener('click', () => {
        // iOS FIX: play() MUST be called synchronously inside user interaction,
        // before any setTimeout, otherwise Safari will block it.
        const playPromise = bgAudio.play();
        if (playPromise !== undefined) {
            playPromise.catch(e => console.log('Audio play failed:', e));
        }

        // Hide the open button
        openBtn.classList.add('hide');

        // Small tick to let repaint happen, then start animations
        setTimeout(() => {
            // ─ INSTANT hide opening-screen background ─────────────────────────
            // No opacity fade — immediately gone so it can NEVER linger over slides.
            // The heart-wrapper is now a separate fixed element (z-index 25),
            // so it animates independently regardless of opening-screen visibility.
            openingScreen.style.display = 'none';

            // ─ Start portal expand ────────────────────────────────────────────
            if (sliderContainer) {
                sliderContainer.style.opacity = '1';
                sliderContainer.classList.add('open');
            }

            // ─ Heart expands (independent element, z-index 25 above slider) ──
            if (heartIcon) heartIcon.classList.add('expand');
            if (starsContainerEl) starsContainerEl.classList.add('show');

            // ─ Wire up nav immediately ────────────────────────────────────────
            updateNavButtons();
            nextBtn.addEventListener('click', goNext);
            prevBtn.addEventListener('click', goPrev);

            // ─ Show music button ──────────────────────────────────────────────
            musicBtn.classList.add('visible');
            musicBtn.classList.add('playing');

            // ─ Hide heart-wrapper after its animation fully completes ─────────
            // heart opacity transition: 1.75s + 0.35s delay = ~2.1s total
            setTimeout(() => {
                if (heartWrapper) heartWrapper.style.display = 'none';
            }, 2200);

        }, 50);
    });

});
