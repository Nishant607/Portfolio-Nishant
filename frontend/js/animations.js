// GSAP and other scroll animations

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync GSAP ScrollTrigger with Lenis
    if (typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    }

    // Initialize Animations only after Preloader finishes
    window.addEventListener('heroAnimationComplete', () => {
        initGSAPScrollTriggers();
    });

    // Top progress bar update
    const progressBar = document.querySelector('.scroll-progress-bar');
    if(progressBar) {
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + "%";
        });
    }

    // VanillaTilt functionality has been removed.
});

function initGSAPScrollTriggers() {
    gsap.registerPlugin(ScrollTrigger);

    // Section reveal animations
    const revealElements = document.querySelectorAll('.gs-reveal');
    revealElements.forEach((elem) => {
        gsap.fromTo(elem, 
            { autoAlpha: 0, y: 50 }, 
            { 
                autoAlpha: 1, 
                y: 0, 
                duration: 1, 
                ease: "power3.out",
                scrollTrigger: {
                    trigger: elem,
                    start: "top 85%",
                    once: true
                }
            }
        );
    });

    // Skill Bars Fill Animation
    const skillFills = document.querySelectorAll('.skill-fill');
    skillFills.forEach((fill) => {
        const targetPercent = fill.getAttribute('data-target');
        gsap.to(fill, {
            width: targetPercent + "%",
            duration: 1.2,
            ease: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            scrollTrigger: {
                trigger: fill.parentElement,
                start: "top 90%",
                once: true
            }
        });
    });

    // CountUp triggers via IntersectionObserver (since we want them together)
    const statsGrid = document.querySelector('.stat-cards-grid');
    if (statsGrid && typeof countUp !== 'undefined') {
        let statsFired = false;
        
        const observer = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting && !statsFired) {
                statsFired = true;
                
                const projCount = new countUp.CountUp('stat-projects', 3, { duration: 2.5, separator: '' });
                const techCount = new countUp.CountUp('stat-technologies', 5, { duration: 2.5, separator: '' });
                const yearsCount = new countUp.CountUp('stat-years', 1, { duration: 2.5, separator: '' });
                
                if (!projCount.error) projCount.start();
                if (!techCount.error) techCount.start();
                if (!yearsCount.error) yearsCount.start();
                
                observer.unobserve(statsGrid);
            }
        }, { threshold: 0.5 });
        
        observer.observe(statsGrid);
    }
}
