document.addEventListener('DOMContentLoaded', function() {
    const flags = document.querySelectorAll('#flags img');

    flags.forEach(flag => {
        flag.addEventListener('mouseover', () => {
            flag.style.transformOrigin = 'center center';
            flag.style.transform = 'scale(1.2)';
            flag.style.transition = 'transform 0.1s ease';
        });

        flag.addEventListener('mousemove', (e) => {
            const rect = flag.getBoundingClientRect();
            const xAxis = (rect.left + rect.width / 2 - e.clientX) / 25;
            const yAxis = (rect.top + rect.height / 2 - e.clientY) / 25;
            flag.style.transform = `scale(1.2) perspective(20px) rotateX(${yAxis}deg) rotateY(${xAxis}deg)`;
        });

        flag.addEventListener('mouseleave', () => {
            flag.style.transform = 'scale(1)';
        });
    });
});
