(function () {
  const ACTIVE_TAB_KEY = 'orion_preview_active_tab';
  const panels = Array.from(document.querySelectorAll('.tab-panel'));
  const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
  const status = document.getElementById('slideStatus');
  const prev = document.getElementById('prevSlide');
  const next = document.getElementById('nextSlide');
  const fullscreenToggle = document.getElementById('fullscreenToggle');
  const slideshowNav = document.querySelector('.slideshow-nav');
  const pageLoader = document.getElementById('pageLoader');
  let ticking = false;
  let navLocked = false;
  let navUnlockTimer = null;

  document.querySelectorAll('img[src*="orion-search.readthedocs.io/en/latest/_images/"]').forEach((img) => {
    const primarySrc = img.getAttribute('src');
    if (!primarySrc) return;
    const fallbackSrc = primarySrc.replace('/en/latest/_images/', '/en/latest/app_docs/_images/');
    if (fallbackSrc === primarySrc) return;
    img.addEventListener('error', () => {
      if (img.dataset.fallbackApplied === '1') return;
      img.dataset.fallbackApplied = '1';
      img.src = fallbackSrc;
    }, { once: true });
  });

  panels.forEach((panel) => {
    const slides = Array.from(panel.querySelectorAll('.slide'));
    slides.forEach((slide, index) => {
      slide.id = panel.id + '-slide-' + (index + 1);

      if (index < slides.length - 1) {
        const footerNumber = slide.querySelector('.footer strong');
        const marker = document.createElement('div');
        marker.className = 'between-slide';
        marker.setAttribute('aria-hidden', 'true');
        marker.innerHTML = '<span>' + (footerNumber ? footerNumber.textContent : String(index + 1).padStart(2, '0')) + '</span>';
        slide.insertAdjacentElement('afterend', marker);
      }
    });
  });

  const getActivePanel = () => document.querySelector('.tab-panel.is-active');
  const getSlides = () => Array.from(getActivePanel().querySelectorAll('.slide'));
  const getSeparators = () => Array.from(getActivePanel().querySelectorAll('.between-slide'));
  const getScrollBlock = () => window.matchMedia('(max-width: 1179px), (max-height: 900px)').matches ? 'start' : 'center';
  const setFullscreenState = () => {
    const isFullscreen = !!document.fullscreenElement;
    document.body.classList.toggle('is-fullscreen', isFullscreen);
    fullscreenToggle.setAttribute('aria-label', isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen');
    fullscreenToggle.textContent = isFullscreen ? '×' : '⛶';
  };

  const scrollToSlide = (index) => {
    if (navLocked) return;

    const slides = getSlides();
    const clamped = Math.max(0, Math.min(index, slides.length - 1));
    const active = slides.findIndex((slide) => slide.classList.contains('is-active'));
    if (clamped === active) return;
    navLocked = true;
    prev.disabled = true;
    next.disabled = true;
    clearTimeout(navUnlockTimer);
    slides[clamped].scrollIntoView({ behavior: 'smooth', block: getScrollBlock() });
    navUnlockTimer = window.setTimeout(() => {
      navLocked = false;
      updateStatus();
    }, 520);
  };

  const updateStatus = () => {
    const slides = getSlides();
    const separators = getSeparators();
    let activeIndex = 0;
    let closest = Infinity;

    slides.forEach((slide, index) => {
      const rect = slide.getBoundingClientRect();
      const distance = Math.abs((rect.top + rect.height / 2) - (window.innerHeight / 2));
      if (distance < closest) {
        closest = distance;
        activeIndex = index;
      }
    });

    slides.forEach((slide, index) => {
      slide.classList.toggle('is-active', index === activeIndex);
    });

    separators.forEach((separator, index) => {
      const nearFocusedPair = index === activeIndex || index === activeIndex - 1;
      separator.classList.toggle('is-near', nearFocusedPair);
    });

    status.textContent = String(activeIndex + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
    prev.disabled = navLocked || activeIndex === 0;
    next.disabled = navLocked || activeIndex === slides.length - 1;
    prev.style.opacity = activeIndex === 0 || navLocked ? '.45' : '1';
    next.style.opacity = activeIndex === slides.length - 1 || navLocked ? '.45' : '1';
  };

  const activateTab = (panelId) => {
    clearTimeout(navUnlockTimer);
    navLocked = false;

    try {
      window.localStorage.setItem(ACTIVE_TAB_KEY, panelId);
    } catch (error) {
    }

    panels.forEach((panel) => {
      panel.classList.toggle('is-active', panel.id === panelId);
    });

    tabButtons.forEach((button) => {
      const isActive = button.dataset.tab === panelId;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    document.querySelectorAll('.slide').forEach((slide) => slide.classList.remove('is-active'));
    document.querySelectorAll('.between-slide').forEach((separator) => separator.classList.remove('is-near'));

    const firstSlide = getSlides()[0];
    if (firstSlide) {
      firstSlide.scrollIntoView({ behavior: 'auto', block: getScrollBlock() });
    }
    updateStatus();
  };

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => activateTab(button.dataset.tab));
  });

  fullscreenToggle.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch (error) {
    }
  });

  prev.addEventListener('click', () => {
    const slides = getSlides();
    const current = slides.findIndex((slide) => slide.classList.contains('is-active'));
    scrollToSlide((current === -1 ? 0 : current) - 1);
  });

  next.addEventListener('click', () => {
    const slides = getSlides();
    const current = slides.findIndex((slide) => slide.classList.contains('is-active'));
    scrollToSlide((current === -1 ? 0 : current) + 1);
  });

  document.addEventListener('keydown', (event) => {
    if (
      event.key !== 'ArrowDown' &&
      event.key !== 'PageDown' &&
      event.key !== 'ArrowUp' &&
      event.key !== 'PageUp' &&
      event.key !== 'ArrowLeft' &&
      event.key !== 'ArrowRight'
    ) {
      return;
    }

    event.preventDefault();
    const slides = getSlides();
    const current = slides.findIndex((slide) => slide.classList.contains('is-active'));
    const index = current === -1 ? 0 : current;

    if (event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === 'ArrowRight') {
      scrollToSlide(index + 1);
    } else {
      scrollToSlide(index - 1);
    }
  });

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateStatus();
      ticking = false;
    });
  }, { passive: true });
  document.addEventListener('fullscreenchange', setFullscreenState);
  window.addEventListener('load', async () => {
    slideshowNav.classList.add('is-hidden');
    try {
      if (document.fonts && document.fonts.ready) {
        await Promise.race([
          document.fonts.ready,
          new Promise((resolve) => setTimeout(resolve, 1200))
        ]);
      }
    } catch (error) {
    }
    let initialTab = 'marketing-panel';
    try {
      const hashTab = window.location.hash ? window.location.hash.slice(1) : '';
      const savedTab = window.localStorage.getItem(ACTIVE_TAB_KEY);
      if (hashTab && panels.some((panel) => panel.id === hashTab)) {
        initialTab = hashTab;
      } else if (savedTab && panels.some((panel) => panel.id === savedTab)) {
        initialTab = savedTab;
      }
    } catch (error) {
    }
    activateTab(initialTab);
    requestAnimationFrame(() => {
      slideshowNav.classList.remove('is-hidden');
      pageLoader.classList.add('is-hidden');
      document.body.classList.remove('is-loading');
    });
  });
  setFullscreenState();
}());
