(() => {
  const slideshowEl = document.querySelector("[data-hero-slideshow]");
  const pageMain = document.querySelector("[data-property-code]");
  const propertyCode = pageMain?.getAttribute("data-property-code");
  const sourceImages = Array.from(document.querySelectorAll("[data-property-image]"));
  const lightbox = document.getElementById("property-lightbox");

  if (!slideshowEl || !lightbox) return;

  const hiddenImages = sourceImages.map((img) => ({
    src: img.getAttribute("src"),
    alt: img.getAttribute("alt") || "Property photo",
  }));

  const imageExists = (src) =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = src;
    });

  const discoverImagesFromDirectory = async () => {
    if (!propertyCode) return [];

    const baseDir = `../../assets/images/properties/${propertyCode}/`;
    const exts = ["jpg", "jpeg", "png", "webp", "avif"];
    const found = [];
    const seen = new Set();
    let missesInRow = 0;
    let foundAny = false;

    // Robust discovery:
    // - supports gaps (g01, g03, g07)
    // - supports both g01 and g1 naming styles
    // - stops early after sustained misses so first render isn't delayed
    for (let i = 1; i <= 120; i += 1) {
      const names = [`g${String(i).padStart(2, "0")}`, `g${i}`];
      const candidates = [];

      names.forEach((name) => {
        exts.forEach((ext) => {
          candidates.push(`${baseDir}${name}.${ext}`);
        });
      });

      // Check all extensions for this index in parallel (faster than sequential awaits).
      // eslint-disable-next-line no-await-in-loop
      const checks = await Promise.all(
        candidates.map(async (src) => ({ src, exists: await imageExists(src) }))
      );

      const matches = checks.filter((item) => item.exists);
      if (matches.length > 0) {
        foundAny = true;
        missesInRow = 0;
        matches.forEach((item) => {
          if (!seen.has(item.src)) {
            seen.add(item.src);
            found.push(item.src);
          }
        });
      } else {
        missesInRow += 1;
        if (foundAny && missesInRow >= 8) break;
      }
    }

    return found.map((src, index) => ({
      src,
      alt: `${propertyCode} photo ${index + 1}`,
    }));
  };

  const init = async () => {
    let images = await discoverImagesFromDirectory();
    if (images.length === 0) images = hiddenImages;
    if (images.length === 0) return;

    const slides = images.map((item, index) => {
      const slide = document.createElement("img");
      slide.className = "hero-slide" + (index === 0 ? " is-active" : "");
      slide.src = item.src;
      slide.alt = item.alt;
      slide.loading = "eager";
      slide.decoding = "async";
      slideshowEl.prepend(slide);
      return slide;
    });

    let activeIndex = 0;
    let timerId = null;

    const setHeroSlide = (index) => {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle("is-active", i === activeIndex));
    };

    const startAuto = () => {
      stopAuto();
      timerId = window.setInterval(() => setHeroSlide(activeIndex + 1), 4000);
    };

    const stopAuto = () => {
      if (timerId) window.clearInterval(timerId);
      timerId = null;
    };

    startAuto();

    const imageEl = lightbox.querySelector("[data-lightbox-image]");
    const thumbsEl = lightbox.querySelector("[data-lightbox-thumbs]");
    const closeBtn = lightbox.querySelector("[data-lightbox-close]");
    const prevBtn = lightbox.querySelector("[data-lightbox-prev]");
    const nextBtn = lightbox.querySelector("[data-lightbox-next]");
    const thumbButtons = [];
    let lightboxIndex = 0;
    let lightboxPreloaded = false;

    const preloadLightboxImages = () => {
      if (lightboxPreloaded) return;
      images.forEach((item) => {
        const preload = new Image();
        preload.decoding = "async";
        preload.src = item.src;
      });
      lightboxPreloaded = true;
    };

    const setLightboxImage = (index) => {
      lightboxIndex = (index + images.length) % images.length;
      imageEl.src = images[lightboxIndex].src;
      imageEl.alt = images[lightboxIndex].alt;
      thumbButtons.forEach((btn, i) => btn.classList.toggle("is-active", i === lightboxIndex));
    };

    images.forEach((item, index) => {
      const thumb = document.createElement("img");
      thumb.className = "lightbox-thumb" + (index === 0 ? " is-active" : "");
      thumb.src = item.src;
      thumb.alt = item.alt;
      thumb.loading = "eager";
      thumb.decoding = "async";
      thumb.addEventListener("click", () => setLightboxImage(index));
      thumbsEl.appendChild(thumb);
      thumbButtons.push(thumb);
    });

    const openLightbox = (index) => {
      preloadLightboxImages();
      setLightboxImage(index);
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    slideshowEl.addEventListener("click", () => openLightbox(activeIndex));
    slideshowEl.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(activeIndex);
      }
    });

    prevBtn.addEventListener("click", () => setLightboxImage(lightboxIndex - 1));
    nextBtn.addEventListener("click", () => setLightboxImage(lightboxIndex + 1));
    closeBtn.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (event) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") setLightboxImage(lightboxIndex - 1);
      if (event.key === "ArrowRight") setLightboxImage(lightboxIndex + 1);
    });

    slideshowEl.addEventListener("mouseenter", stopAuto);
    slideshowEl.addEventListener("mouseleave", startAuto);
  };

  init();
})();
