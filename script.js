document.addEventListener('DOMContentLoaded', () => {
    // 1. Particle Stars Generation
    const starsContainer = document.getElementById('stars-container');
    const starCount = 150;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;

        // Random size
        const size = Math.random() * 2 + 1;

        // Random animation duration
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 5;

        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.setProperty('--duration', `${duration}s`);
        star.style.animationDelay = `${delay}s`;

        starsContainer.appendChild(star);
    }

    // 2. Auto-Slide Carousel Logic
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    const slideInterval = 6000; // 6 seconds
    let slideTimer;

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    function prevSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    // 3. Opening Animation Logic
    const openBtn = document.getElementById('openBtn');
    const heartIcon = document.getElementById('heartIcon');
    const sliderContainer = document.getElementById('sliderContainer');
    const bgAudio = document.getElementById('bg-audio');
    const openingScreen = document.getElementById('openingScreen');
    const starsContainerEl = document.getElementById('stars-container');

    openBtn.addEventListener('click', () => {
        // Play Audio (Don't let it block the animation if it fails)
        if (bgAudio) {
            bgAudio.play().catch(e => console.log("Audio play deferred or failed"));
        }
        
        // Hide button
        openBtn.classList.add('hide');

        // Start animations immediately
        setTimeout(() => {
            if (sliderContainer) {
                sliderContainer.style.opacity = '1'; // Pastikan langsung terlihat
                sliderContainer.classList.add('open');
            }
            if (heartIcon) heartIcon.classList.add('expand');
            if (starsContainerEl) starsContainerEl.classList.add('show');
            
            // Wait for portal animation
            setTimeout(() => {
                openingScreen.style.opacity = '0';
                
                // Manual Navigation Listeners
                const nextBtn = document.getElementById('nextBtn');
                const prevBtn = document.getElementById('prevBtn');
                
                if (nextBtn) nextBtn.addEventListener('click', nextSlide);
                if (prevBtn) prevBtn.addEventListener('click', prevSlide);
                
                setTimeout(() => {
                    openingScreen.style.display = 'none';
                }, 1500);
            }, 3000);
        }, 50);
    });

});
