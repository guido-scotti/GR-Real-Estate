// Variables globales para el visor de imágenes
let lightboxImages = [];
let lightboxCurrentIndex = 0;

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
    // LOGICA DE SLIDER DE IMAGENES
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
    // LOGICA DE CAROUSEL DE IMAGENES
    // ==========================================
    const carousels = document.querySelectorAll('.carousel-container');
        
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextBtn = carousel.querySelector('.next-btn');
        const prevBtn = carousel.querySelector('.prev-btn');
        let currentIndex = 0;
        let isSwiping = false; // Bandera para diferenciar swipe de clic

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

        // Lógica Táctil (Swipe)
        let startX = 0;
        
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isSwiping = false; // Reiniciamos la bandera al tocar
        }, {passive: true});

        track.addEventListener('touchmove', (e) => {
            let currentX = e.touches[0].clientX;
            // Si el dedo se movió más de 10px, es un arrastre, no un clic
            if (Math.abs(startX - currentX) > 10) {
                isSwiping = true;
            }
        }, {passive: true});

        track.addEventListener('touchend', (e) => {
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
        });

        // Prevenir que se abra el modal si el usuario estaba deslizando la foto
        track.addEventListener('click', (e) => {
            if (isSwiping) {
                e.stopPropagation();
                e.preventDefault();
            }
        });
    });

    // ==========================================
    // EVENTOS TÁCTILES PARA EL LIGHTBOX MÓVIL
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
// FUNCIONES GLOBALES (Modales y Lightbox)
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
    if (window.innerWidth >= 1024) return; // Solo funciona en celulares
    e.stopPropagation();

    const track = imgElement.closest('.carousel-track');
    if (!track) return;

    const imgs = Array.from(track.querySelectorAll('img'));
    
    // Guardamos todas las fotos del carrusel actual
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