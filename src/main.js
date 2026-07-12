// ============================================
// 1. MOBILE MENU
// ============================================
const menuBtn = document.getElementById('menu-btn');
if (menuBtn) {
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
}
 



// ============================================
// SCROLL REVEAL ANIMATION (fixed)
// Handles BOTH [data-reveal] AND .animate-on-scroll
// ============================================
(function () {
    const targets = document.querySelectorAll('[data-reveal], .animate-on-scroll');
    if (targets.length === 0) return;

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const el = entry.target;
                const delayAttr = el.dataset.revealDelay;
                const delayMatch = el.className.match(/delay-(\d+)/);
                const delay = delayAttr ? parseInt(delayAttr, 10) : (delayMatch ? parseInt(delayMatch[1], 10) : 0);

                setTimeout(() => {
                    el.classList.add('is-visible');
                }, delay);

                revealObserver.unobserve(el);
            });
        },
        {
            root: null,
            rootMargin: '0px 0px -60px 0px',
            threshold: 0.05
        }
    );

    targets.forEach((el) => revealObserver.observe(el));
})();

// ============================================
// 2. TESTIMONIALS CAROUSEL (homepage only)
// ============================================
(function () {   
    const track = document.getElementById('testimonialSlides');
    
    // Guard: skip if not on the homepage
    if (!track) return;

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
})();

// ============================================
// 3. VALUE CARDS REVEAL (mission page)
// ============================================
const cards = document.querySelectorAll(".value-card");

if (cards.length > 0) {
    // Prepare initial (hidden) state before the observer kicks in
    cards.forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(16px)";
      card.style.transition = "opacity 0.5s ease, transform 0.5s ease, box-shadow 0.2s ease";
    });

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const card = entry.target;
          const index = Array.from(cards).indexOf(card);

          // stagger each card slightly so they animate in left-to-right
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, index * 100);

          revealObserver.unobserve(card);
        });
      },
      { threshold: 0.2 }
    );

    cards.forEach((card) => revealObserver.observe(card));

    // Subtle hover lift
    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        card.style.boxShadow = "0 8px 24px rgba(15, 23, 42, 0.08)";
      });
      card.addEventListener("mouseleave", () => {
        card.style.boxShadow = "";
      });
    });
}

// ============================================
// 4. TIMELINE ANIMATION (mission page)
// ============================================
const timelineItems = document.querySelectorAll('.timeline-item');

if (timelineItems.length > 0) {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                const timelineLine = document.getElementById('timelineLine');
                if (timelineLine && entry.target === document.querySelector('.timeline-item')) {
                    timelineLine.classList.add('active');
                }
            }
        });
    }, observerOptions);

    timelineItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.2}s`;
        observer.observe(item);
    });
}


// whatsapp-button.js
// Builds the WhatsApp deep link dynamically and adds small UX touches.

const WHATSAPP_CONFIG = {
  phoneNumber: "13463979427", // replace with your real number, international format, no + or spaces
  defaultMessage: "Hello Charitycraft, I'd like to know more about your cause.",
};

function buildWhatsAppLink({ phoneNumber, defaultMessage }) {
  const encodedMessage = encodeURIComponent(defaultMessage);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

function initWhatsAppButton() {
  const btn = document.getElementById("whatsapp-btn");
  if (!btn) return;

  btn.href = buildWhatsAppLink(WHATSAPP_CONFIG);

  // Optional: hide the button while scrolling down fast, show when idle/scrolling up
  let lastScrollY = window.scrollY;
  let hideTimeout = null;

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY) {
      btn.classList.add("opacity-0", "pointer-events-none");
    } else {
      btn.classList.remove("opacity-0", "pointer-events-none");
    }

    lastScrollY = currentScrollY;

    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      btn.classList.remove("opacity-0", "pointer-events-none");
    }, 600);
  });
}

document.addEventListener("DOMContentLoaded", initWhatsAppButton);