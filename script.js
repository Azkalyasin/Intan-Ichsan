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

    // 3. Opening Animation Logic
    const openBtn = document.getElementById('openBtn');
    const heartIcon = document.getElementById('heartIcon');
    const sliderContainer = document.getElementById('sliderContainer');
    const bgAudio = document.getElementById('bg-audio');
    const openingScreen = document.getElementById('openingScreen');
    const starsContainerEl = document.getElementById('stars-container');

    openBtn.addEventListener('click', () => {
        // Play Audio
        bgAudio.play().catch(error => console.log("Audio play failed:", error));
        
        // Hide button
        openBtn.classList.add('hide');

        // Small delay to let button fade start, then trigger portal
        setTimeout(() => {
            sliderContainer.classList.add('open');
            heartIcon.classList.add('expand');
            starsContainerEl.classList.add('show');
            
            // Wait for portal animation to finish (3.5s)
            setTimeout(() => {
                openingScreen.style.opacity = '0';
                
                // Start the carousel
                slideTimer = setInterval(nextSlide, slideInterval);
                
                // Completely hide opening screen after its opacity fades
                setTimeout(() => {
                    openingScreen.style.display = 'none';
                }, 1500);
            }, 3500);
        }, 100);
    });

});
