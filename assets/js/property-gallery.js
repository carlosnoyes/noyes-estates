(() => {
  const slideshowEl = document.querySelector("[data-hero-slideshow]");
  const propertyContent = document.querySelector(".property-content");
  const lightbox = document.getElementById("property-lightbox");

  if (!slideshowEl || !lightbox) return;

  const images = Array.from(document.querySelectorAll("[data-gallery-image]")).map((img) => ({
    src: img.getAttribute("src"),
    alt: img.getAttribute("alt") || "Property photo",
  }));

  if (images.length === 0) return;

  const introOverlay = slideshowEl.querySelector(".property-intro-overlay");
  if (introOverlay && propertyContent && !propertyContent.querySelector(".property-intro-inline")) {
    const inlineIntro = document.createElement("div");
    inlineIntro.className = "property-intro-inline";
    Array.from(introOverlay.querySelectorAll("p")).forEach((p) => {
      inlineIntro.appendChild(p.cloneNode(true));
    });
    propertyContent.prepend(inlineIntro);
  }

  const slides = images.map((item, index) => {
    const slide = document.createElement("img");
    slide.className = "hero-slide" + (index === 0 ? " is-active" : "");
    slide.src = item.src;
    slide.alt = item.alt;
    slide.loading = "eager";
    slide.decoding = "async";
    slideshowEl.appendChild(slide);
    return slide;
  });

  let activeIndex = 0;

  const setHeroSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("is-active", i === activeIndex));
  };

  const imageEl = lightbox.querySelector("[data-lightbox-image]");
  const thumbsEl = lightbox.querySelector("[data-lightbox-thumbs]");
  const closeBtn = lightbox.querySelector("[data-lightbox-close]");
  const prevBtn = lightbox.querySelector("[data-lightbox-prev]");
  const nextBtn = lightbox.querySelector("[data-lightbox-next]");
  const heroPrevBtn = slideshowEl.querySelector("[data-hero-prev]");
  const heroNextBtn = slideshowEl.querySelector("[data-hero-next]");

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

  if (heroPrevBtn) {
    heroPrevBtn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      setHeroSlide(activeIndex - 1);
    });
  }

  if (heroNextBtn) {
    heroNextBtn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      setHeroSlide(activeIndex + 1);
    });
  }

  slideshowEl.addEventListener("click", (event) => {
    if (event.target.closest("[data-hero-prev],[data-hero-next]")) return;
    openLightbox(activeIndex);
  });

  slideshowEl.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setHeroSlide(activeIndex - 1);
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setHeroSlide(activeIndex + 1);
      return;
    }
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
})();
