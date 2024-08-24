document.querySelectorAll('.full-screen').forEach(element => {
    const speed = 0.3;
    const parallaxOffset = (window.scrollY - element.offsetTop + window.innerHeight - element.offsetHeight / 5) * speed;
    element.style.backgroundPosition = `center ${-parallaxOffset}px`;
    window.addEventListener('scroll', () => {
        const speed = 0.3;
        const parallaxOffset = (window.scrollY - element.offsetTop + window.innerHeight - element.offsetHeight / 5) * speed;
        element.style.backgroundPosition = `center ${-parallaxOffset}px`;
    });
});
