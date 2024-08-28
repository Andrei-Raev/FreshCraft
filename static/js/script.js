const speed = 0.3;

function updateParallax(element) {
    const parallaxOffset = (window.scrollY - element.offsetTop + window.innerHeight - element.offsetHeight / 5) * speed;
    element.style.backgroundPosition = `center ${-parallaxOffset}px`;
}

document.querySelectorAll('.full-screen').forEach(element => {
    updateParallax(element);

    window.addEventListener('scroll', () => updateParallax(element));
});
