// Variables globales para el visor de imágenes
let lightboxImages = [];
let lightboxCurrentIndex = 0;
window.isGlobalSwiping = false; // NUEVO: Bandera para proteger el swipe

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // LOGICA DE MENU MOBILE
    // ==========================================
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

    // ==========================================
    // LOGICA DE SLIDER DE IMAGENES (HERO)
    // ==========================================
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

    // ==========================================
    // LOGICA DE CAROUSEL DE IMAGENES (Fichas y Modales)
    // ==========================================
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
        // LÓGICA TÁCTIL (Aplicada al CAROUSEL, no al track)
        // ==========================================
        let startX = 0;
        
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            window.isGlobalSwiping = false; // Reiniciamos al tocar
        }, {passive: true});

        carousel.addEventListener('touchmove', (e) => {
            let currentX = e.touches[0].clientX;
            // Si el dedo se mueve, marcamos que está arrastrando
            if (Math.abs(startX - currentX) > 10) {
                window.isGlobalSwiping = true;
            }
        }, {passive: true});

        carousel.addEventListener('touchend', (e) => {
            let endX = e.changedTouches[0].clientX;
            const umbral = 40;
            const diferencia = startX - endX;

            if (Math.abs(diferencia) > umbral && slides.length > 1) {
                if (diferencia > 0) {
                    currentIndex = (currentIndex + 1) % slides.length;
                } else {
                    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                }
                updateCarousel();
            }
            
            // Apagamos la bandera con un micro-delay para que frene los clics falsos
            setTimeout(() => {
                window.isGlobalSwiping = false;
            }, 50);
        });

        // Prevenir que un toque abra el modal externo si estábamos deslizando
        carousel.addEventListener('click', (e) => {
            if (window.isGlobalSwiping) {
                e.stopPropagation();
                e.preventDefault();
            }
        });
    });

    // ==========================================
    // LÓGICA TÁCTIL DEL LIGHTBOX (Pantalla completa)
    // ==========================================
    const lightboxTouchArea = document.getElementById('lightbox-touch-area');
    
    if(lightboxTouchArea) {
        let lbStartX = 0;
        
        lightboxTouchArea.addEventListener('touchstart', (e) => {
            lbStartX = e.touches[0].clientX;
        }, {passive: true});

        lightboxTouchArea.addEventListener('touchend', (e) => {
            let lbEndX = e.changedTouches[0].clientX;
            let diff = lbStartX - lbEndX;

            if (Math.abs(diff) > 40 && lightboxImages.length > 1) {
                if (diff > 0) {
                    lightboxCurrentIndex = (lightboxCurrentIndex + 1) % lightboxImages.length;
                } else {
                    lightboxCurrentIndex = (lightboxCurrentIndex - 1 + lightboxImages.length) % lightboxImages.length;
                }
                actualizarImagenLightbox();
            }
        });
    }

});

// ==========================================
// FUNCIONES GLOBALES
// ==========================================
function abrirModal(id) {
    const modal = document.getElementById(id);
    if(!modal) return;
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
    }, 10);
    document.body.style.overflow = 'hidden';
}

function cerrarModal(id) {
    const modal = document.getElementById(id);
    if(!modal) return;
    modal.classList.add('opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
    document.body.style.overflow = 'auto';
}

function abrirLightbox(e, imgElement) {
    // BLOQUEO: Si el usuario movió el dedo (swipe), NO abrimos la foto.
    if (window.isGlobalSwiping) {
        e.stopPropagation();
        e.preventDefault();
        return;
    }

    if (window.innerWidth >= 1024) return; // Exclusivo mobile
    e.stopPropagation();

    const track = imgElement.closest('.carousel-track');
    if (!track) return;

    const imgs = Array.from(track.querySelectorAll('img'));
    
    lightboxImages = imgs.map(img => img.src);
    lightboxCurrentIndex = imgs.indexOf(imgElement);

    actualizarImagenLightbox();

    const lightbox = document.getElementById('mobile-lightbox');
    if(lightbox) {
        lightbox.classList.remove('hidden');
        setTimeout(() => lightbox.classList.remove('opacity-0'), 10);
    }
}

function actualizarImagenLightbox() {
    const img = document.getElementById('lightbox-img');
    if (img && lightboxImages.length > 0) {
        img.src = lightboxImages[lightboxCurrentIndex];
    }
}

function cerrarLightbox(e) {
    if(e) e.stopPropagation();
    const lightbox = document.getElementById('mobile-lightbox');
    if(lightbox) {
        lightbox.classList.add('opacity-0');
        setTimeout(() => lightbox.classList.add('hidden'), 300);
    }
}