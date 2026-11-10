
const music = document.getElementById("birthdayMusic");
const musicToggle = document.getElementById("musicToggle");
const musicLabel = document.getElementById("musicLabel");
const openInvitation = document.getElementById("openInvitation");

// Background music
async function startMusic() {
  try {
    await music.play();
    musicLabel.textContent = "Pause music";
    musicToggle.setAttribute("aria-label", "Pause music");
  } catch (error) {
    musicLabel.textContent = "Tap for music";
  }
}

function stopMusic() {
  music.pause();
  musicLabel.textContent = "Play music";
  musicToggle.setAttribute("aria-label", "Play music");
}

musicToggle.addEventListener("click", () => {
  music.paused ? startMusic() : stopMusic();
});

openInvitation.addEventListener("click", async () => {
  await startMusic();
  document.getElementById("invitation").scrollIntoView({
    behavior: "smooth"
  });
});

// Countdown to 16 November 2026
const eventDate = new Date("2026-11-16T19:00:00+05:30");

function updateCountdown() {
  const remaining = Math.max(0, eventDate.getTime() - Date.now());

  const values = {
    days: Math.floor(remaining / 86400000),
    hours: Math.floor((remaining % 86400000) / 3600000),
    minutes: Math.floor((remaining % 3600000) / 60000),
    seconds: Math.floor((remaining % 60000) / 1000)
  };

  Object.entries(values).forEach(([id, value]) => {
    document.getElementById(id).textContent =
      String(value).padStart(2, "0");
  });
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Reveal photos and sections while scrolling
const revealTargets = document.querySelectorAll(
  '.welcome, .invitation-card, .quote-band-inner, .photo-card, .countdown-grid div, .closing, .hero-photo'
);

revealTargets.forEach((element, index) => {
  element.classList.add("reveal-on-scroll");

  if (element.classList.contains("photo-card")) {
    element.style.setProperty(
      "--reveal-delay",
      `${(index % 6) * 85}ms`
    );
  }
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  revealTargets.forEach(element =>
    revealObserver.observe(element)
  );
} else {
  revealTargets.forEach(element =>
    element.classList.add("is-visible")
  );
}

// Gallery photo lightbox
const galleryImages = [
  ...document.querySelectorAll(".photo-card img")
];

const lightbox = document.getElementById("photoLightbox");
const lightboxImage = document.getElementById("lightboxImage");

let activePhoto = 0;

function showPhoto(index) {
  activePhoto =
    (index + galleryImages.length) % galleryImages.length;

  lightboxImage.classList.remove("photo-changing");
  void lightboxImage.offsetWidth;

  lightboxImage.src = galleryImages[activePhoto].src;
  lightboxImage.alt = galleryImages[activePhoto].alt;

  lightboxImage.classList.add("photo-changing");
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
}

galleryImages.forEach((img, index) => {
  const card = img.closest(".photo-card");

  card.setAttribute("tabindex", "0");
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", "View photo");

  const open = () => {
    showPhoto(index);
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
  };

  card.addEventListener("click", open);

  card.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  });
});

document.getElementById("lightboxClose")
  .addEventListener("click", closeLightbox);

document.getElementById("lightboxPrev")
  .addEventListener("click", () =>
    showPhoto(activePhoto - 1)
  );

document.getElementById("lightboxNext")
  .addEventListener("click", () =>
    showPhoto(activePhoto + 1)
  );

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", event => {
  if (!lightbox.classList.contains("open")) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showPhoto(activePhoto - 1);
  if (event.key === "ArrowRight") showPhoto(activePhoto + 1);
});


/* =================================
   AUTOMATIC SLOW SCROLLING
================================= */


/* AUTOMATIC SCROLLING WITH MANUAL CONTROL */

let autoScrollTimer = null;
let resumeScrollTimer = null;

const AUTO_SCROLL_SPEED = 1;
const AUTO_SCROLL_INTERVAL = 30;
const RESUME_DELAY = 3000;

function stopAutoScroll() {
    clearInterval(autoScrollTimer);
    autoScrollTimer = null;
}

function startAutoScroll() {
    if (autoScrollTimer !== null) return;

    autoScrollTimer = setInterval(() => {
        const page = document.scrollingElement;
        const maxScroll = page.scrollHeight - window.innerHeight;

        if (page.scrollTop >= maxScroll - 2) {
            stopAutoScroll();
            return;
        }

        page.scrollTop += AUTO_SCROLL_SPEED;

    }, AUTO_SCROLL_INTERVAL);
}

function pauseAndResumeAutoScroll() {
    stopAutoScroll();
    clearTimeout(resumeScrollTimer);

    resumeScrollTimer = setTimeout(() => {
        startAutoScroll();
    }, RESUME_DELAY);
}

/* Detect manual scrolling on mobile and desktop */
window.addEventListener("scroll", pauseAndResumeAutoScroll, {
    passive: true
});

/* Start automatic scrolling after 3 seconds */
window.addEventListener("load", () => {
    setTimeout(startAutoScroll, 3000);
}, { once: true });





/* =================================
   AUTOMATIC BIRTHDAY MUSIC
================================= */

music.volume = 0.5;

// Try autoplay when the page loads
music.play().then(() => {
    musicLabel.textContent = "Pause music";
    musicToggle.setAttribute("aria-label", "Pause music");
}).catch(() => {
    // If Safari blocks autoplay, start after first interaction
    const playAfterInteraction = () => {
        startMusic();

        document.removeEventListener("click", playAfterInteraction);
        document.removeEventListener("touchstart", playAfterInteraction);
    };

    document.addEventListener("click", playAfterInteraction);
    document.addEventListener("touchstart", playAfterInteraction);
});
