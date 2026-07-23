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
            const slides = Array.from(track.children);
            const nextBtn = carousel.querySelector('.next-btn');
            const prevBtn = carousel.querySelector('.prev-btn');
            let currentIndex = 0;

            const updateCarousel = () => {
                const width = carousel.getBoundingClientRect().width;
                track.style.transform = `translateX(-${currentIndex * width}px)`;
            };

            // Lógica de botones de escritorio
            if (nextBtn && prevBtn && slides.length > 1) {
                nextBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    currentIndex = (currentIndex + 1) % slides.length;
                    updateCarousel();
                });

                prevBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                    updateCarousel();
                });
                
                window.addEventListener('resize', updateCarousel);
            }

            // ==========================================
            // NUEVO: LÓGICA TÁCTIL (SWIPE PARA MOBILE)
            // ==========================================
            let startX = 0;
            let endX = 0;

            track.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            }, {passive: true});

            track.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                handleSwipe();
            });

            const handleSwipe = () => {
                const umbral = 40; // Píxeles de movimiento necesarios para que cuente como swipe
                const diferencia = startX - endX;

                // Si el movimiento es mayor al umbral, pasamos la foto
                if (Math.abs(diferencia) > umbral && slides.length > 1) {
                    if (diferencia > 0) {
                        // Deslizó hacia la izquierda -> Foto Siguiente
                        currentIndex = (currentIndex + 1) % slides.length;
                    } else {
                        // Deslizó hacia la derecha -> Foto Anterior
                        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                    }
                    updateCarousel();
                }
            };
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

function abrirLightbox(e, src) {
    if (window.innerWidth < 1024) {
        e.stopPropagation(); // Evita que se disparen otras acciones
        const lightbox = document.getElementById('mobile-lightbox');
        const img = document.getElementById('lightbox-img');
        
        img.src = src;
        lightbox.classList.remove('hidden');
        setTimeout(() => lightbox.classList.remove('opacity-0'), 10);
    }
}

function cerrarLightbox() {
    const lightbox = document.getElementById('mobile-lightbox');
    lightbox.classList.add('opacity-0');
    setTimeout(() => lightbox.classList.add('hidden'), 300);
}