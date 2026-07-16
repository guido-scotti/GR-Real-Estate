        const btn = document.getElementById('mobile-menu-btn');
        const menu = document.getElementById('mobile-menu');

        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });

        document.querySelectorAll('#mobile-menu a').forEach(link => {
            link.addEventListener('click', () => menu.classList.add('hidden'));
        });
        
        document.addEventListener('DOMContentLoaded', () => {
        const slider = document.getElementById('slider');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        let currentIndex = 0;
        // Cuenta cuántos "hijos" (slides) tiene el contenedor
        const totalSlides = slider.children.length;

        // Función para mover el slider
        const updateSlider = () => {
            // Desplaza el slider un 100% hacia la izquierda por cada índice
            slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        };

        // Botón Siguiente
        nextBtn.addEventListener('click', () => {
            // Si llega al final, vuelve al principio (índice 0)
            currentIndex = (currentIndex + 1) % totalSlides;
            updateSlider();
        });

        // Botón Anterior
        prevBtn.addEventListener('click', () => {
            // Si está en el principio, va al final
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateSlider();
        });
        });