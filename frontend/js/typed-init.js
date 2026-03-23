// Typed.js Initialization
document.addEventListener("DOMContentLoaded", () => {
    
    // We want to start the typewriter only after the preloader finishes.
    // We listen for a custom event from main.js, or just wait a predefined time.
    window.addEventListener('heroAnimationComplete', initTyped);
    
    // Fallback in case main.js load sequencing fails
    setTimeout(() => {
        if(!window.typedStarted) initTyped();
    }, 3500);
});

function initTyped() {
    if(window.typedStarted) return;
    window.typedStarted = true;
    
    const typedElement = document.getElementById('typed');
    if(typedElement) {
        new Typed('#typed', {
            strings: [
                'Backend Developer', 
                'API Architect', 
                'Django Specialist', 
                'System Builder',
                'REST API Engineer'
            ],
            typeSpeed: 60,
            backSpeed: 35,
            backDelay: 2000,
            loop: true,
            cursorChar: '|',
            autoInsertCss: true,
        });
    }
}
