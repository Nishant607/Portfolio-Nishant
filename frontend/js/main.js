document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Preloader and Hero Animation Sequence (GSAP Timeline)
    const tl = gsap.timeline({
        onComplete: () => {
            // Document body no longer locked if we did
            document.body.style.overflow = '';
            // Fire event for other scripts (typed.js, scroll animations)
            window.dispatchEvent(new Event('heroAnimationComplete'));
        }
    });

    // We assume body has overflow: hidden applied in CSS natively if preferred, or we just rely on instant lock
    document.body.style.overflow = 'hidden';

    // 0.0 - 1.2s: Preloader loading bar
    tl.to(".loading-progress", { width: "100%", duration: 1.2, ease: "power2.inOut" }, 0);
    
    // 1.2s: Preloader fades out, moves up
    tl.to("#preloader", {
        opacity: 0,
        y: "-100%",
        duration: 0.8,
        ease: "power3.inOut"
    }, 1.2);

    // 1.4s: Navbar slides down
    tl.fromTo("#navbar", 
        { y: -80, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 
    1.4);

    // 1.6s: Hero left content greeting fades in
    tl.fromTo(".hero-greeting", 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 
    1.6);

    // 1.8s: Name animates
    tl.fromTo(".hero-name", 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 
    1.8);

    // 2.0s: Role / Typewriter wrapper reveals (Typewriter handles itself via event)
    tl.fromTo(".hero-role", 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.5 }, 
    2.0);

    // 2.2s: Tagline fades up
    tl.fromTo(".hero-tagline, .hero-stats", 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", stagger: 0.1 }, 
    2.2);

    // 2.4s: CTA buttons scale in
    tl.fromTo(".hero-cta a", 
        { scale: 0.8, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)", stagger: 0.15 }, 
    2.4);

    // 2.6s: Social icons stagger in
    tl.fromTo(".hero-socials a", 
        { x: -20, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 0.5, ease: "power2.out", stagger: 0.1 }, 
    2.6);

    // 2.8s: Three.js canvas fades in
    tl.fromTo(".hero-3d-container", 
        { opacity: 0 }, 
        { opacity: 1, duration: 1, ease: "power2.out" }, 
    2.8);


    // 2. Navbar Scroll Behavior
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Active link highlighting
        let current = "";
        const sections = document.querySelectorAll('section');
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.nav-links li a').forEach((a) => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    });

    // 3. Hamburger Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            document.body.classList.toggle('nav-active');
            // Toggle hamburger icon animation
            const lines = document.querySelectorAll('.hamburger .line');
            if(document.body.classList.contains('nav-active')) {
                lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                lines[1].style.opacity = '0';
                lines[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                lines[0].style.transform = 'none';
                lines[1].style.opacity = '1';
                lines[2].style.transform = 'none';
            }
        });
        
        // Close menu on link click
        document.querySelectorAll('.nav-links li a').forEach(link => {
            link.addEventListener('click', () => {
                document.body.classList.remove('nav-active');
                const lines = document.querySelectorAll('.hamburger .line');
                lines[0].style.transform = 'none';
                lines[1].style.opacity = '1';
                lines[2].style.transform = 'none';
            });
        });
    }
});
