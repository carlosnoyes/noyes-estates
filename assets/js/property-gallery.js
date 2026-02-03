(() => {
  const slideshowEl = document.querySelector("[data-hero-slideshow]");
  const propertyContent = document.querySelector(".property-content");

  if (!slideshowEl) return;

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

  const heroPrevBtn = slideshowEl.querySelector("[data-hero-prev]");
  const heroNextBtn = slideshowEl.querySelector("[data-hero-next]");

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

  slideshowEl.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setHeroSlide(activeIndex - 1);
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setHeroSlide(activeIndex + 1);
    }
  });
})();
