// Custom Cursor Logic
document.addEventListener("DOMContentLoaded", () => {
    // Return early if it's a touch device / small screen
    if (window.innerWidth <= 768 || ('ontouchstart' in window) || navigator.maxTouchPoints > 0) {
        document.body.style.cursor = 'auto';
        const els = document.querySelectorAll('a, button');
        els.forEach(el => el.style.cursor = 'pointer');
        
        const dot = document.querySelector('.cursor-dot');
        const ring = document.querySelector('.cursor-ring');
        if(dot) dot.style.display = 'none';
        if(ring) ring.style.display = 'none';
        return;
    }

    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    
    let ringX = mouseX;
    let ringY = mouseY;

    // Fast tracking for the dot, smooth tracking for the ring
    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Exact position for dot
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    const render = () => {
        // Lerp for inner ring
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        
        ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
        requestAnimationFrame(render);
    };
    
    requestAnimationFrame(render);

    // Hover effects
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .project-card, .hamburger');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            ring.classList.add('hovered');
            dot.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(0.5)`;
        });
        
        el.addEventListener('mouseleave', () => {
            ring.classList.remove('hovered');
            dot.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(1)`;
        });
    });

    // Click effect
    window.addEventListener('mousedown', () => {
        ring.style.transform = `translate(${ringX}px, ${ringY}px) scale(0.8)`;
    });

    window.addEventListener('mouseup', () => {
        ring.style.transform = `translate(${ringX}px, ${ringY}px) scale(1)`;
    });
});
