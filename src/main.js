const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const iconOpen = document.getElementById('icon-open');
const iconClose = document.getElementById('icon-close');

menuBtn.addEventListener('click', () => {
    const isOpen = !mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden');
    iconOpen.classList.toggle('hidden');
    iconClose.classList.toggle('hidden');
    menuBtn.setAttribute('aria-expanded', String(!isOpen));
});

(function () {   // ← ADD OPENING PARENTHESIS HERE
    const track = document.getElementById('testimonialSlides');
    const slides = track.children;
    const totalSlides = slides.length;
    const dots = document.querySelectorAll('#dotsContainer .dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let currentIndex = 0;
    let autoplayTimer = null;
    const AUTOPLAY_DELAY = 6000;

    function goToSlide(index) {
      currentIndex = (index + totalSlides) % totalSlides;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    }

    function updateDots() {
      dots.forEach((dot, i) => {
        if (i === currentIndex) {
          dot.classList.remove('bg-gray-300');
          dot.classList.add('bg-gray-900');
        } else {
          dot.classList.remove('bg-gray-900');
          dot.classList.add('bg-gray-300');
        }
      });
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(nextSlide, AUTOPLAY_DELAY);
    }

    function stopAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
    }

    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoplay();
    });

    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoplay();
    });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        goToSlide(i);
        startAutoplay();
      });
    });

    const carousel = track.closest('.relative');
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? nextSlide() : prevSlide();
        startAutoplay();
      }
    }, { passive: true });

    goToSlide(0);
    startAutoplay();
})();   // ← this closing part was already correct