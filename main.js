document.addEventListener('DOMContentLoaded', () => {

    // LOGICA DE MENU MOBILE
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        document.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
        });
    }

    // LOGICA DE SLIDER DE IMAGENES
    const slider = document.getElementById('slider');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (slider && prevBtn && nextBtn) {
        let currentIndex = 0;
        const totalSlides = slider.children.length;

        const updateSlider = () => {
            slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        };

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateSlider();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateSlider();
        });
    }

    // LOGICA DE CAROUSEL DE IMAGENES
    const carousels = document.querySelectorAll('.carousel-container');

    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const images = carousel.querySelectorAll('.carousel-track img');
        const prevCardBtn = carousel.querySelector('.prev-btn');
        const nextCardBtn = carousel.querySelector('.next-btn');

        let cIndex = 0;
        const totalImages = images.length;

        if (totalImages <= 1) {
            if (prevCardBtn) prevCardBtn.style.display = 'none';
            if (nextCardBtn) nextCardBtn.style.display = 'none';
            return;
        }

        function updateCarousel() {
            track.style.transform = `translateX(-${cIndex * 100}%)`;
        }

        nextCardBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // evita que abra el modal al usar la flecha
            cIndex = (cIndex === totalImages - 1) ? 0 : cIndex + 1;
            updateCarousel();
        });

        prevCardBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            cIndex = (cIndex === 0) ? totalImages - 1 : cIndex - 1;
            updateCarousel();
        });
    });

});

// FUNCIONES DE MODAL
function abrirModal(id) {
    const modal = document.getElementById(id);
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
    }, 10);
    document.body.style.overflow = 'hidden';
}

function cerrarModal(id) {
    const modal = document.getElementById(id);
    modal.classList.add('opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
    document.body.style.overflow = 'auto';
}