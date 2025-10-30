document.addEventListener("DOMContentLoaded", () => {
  const BREAKPOINT = 1200;
  const swiperInstances = [];
  let isSwiperActive = false;
  let resizeTimeout;
  let isResizePending = false;

  function initSwipers() {
    const swipers = document.querySelectorAll(".swiper");

    swipers.forEach((container, index) => {
      if (!container) return;
      if (swiperInstances[index]) return;

      try {
        const paginationEl = container.querySelector(".swiper-pagination");
        const nextEl = container.querySelector(".swiper-button-next");
        const prevEl = container.querySelector(".swiper-button-prev");

        const paginationOptions = paginationEl
          ? { el: paginationEl, clickable: true }
          : false;
        const navigationOptions = nextEl && prevEl ? { nextEl, prevEl } : false;

        swiperInstances[index] = new Swiper(container, {
          slidesPerView: 1,
          spaceBetween: 16,
          loop: true,
          pagination: paginationOptions,
          navigation: navigationOptions,
          observer: true,
        });
      } catch (error) {
        console.error("Ошибка при инициализации Swiper:", error);
      }
    });
  }

  function destroySwipers() {
    swiperInstances.forEach((instance, index) => {
      if (instance && typeof instance.destroy === "function") {
        instance.destroy(true, true);
        swiperInstances[index] = null;
      }
    });
    swiperInstances.length = 0;
  }

  function checkScreenWidth() {
    const isDesktop = window.innerWidth >= BREAKPOINT;

    if (isDesktop && !isSwiperActive) {
      initSwipers();
      isSwiperActive = true;
      console.log("Состояние слайдера: активен");
    } else if (!isDesktop && isSwiperActive) {
      destroySwipers();
      isSwiperActive = false;
      console.log("Состояние слайдера: неактивен");
    }
  }

  function handleResize() {
    if (isResizePending) return;
    isResizePending = true;

    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      checkScreenWidth();
      isResizePending = false;
    }, 150);
  }

  window.addEventListener("resize", handleResize);
  checkScreenWidth();

  window.addEventListener("beforeunload", () => {
    window.removeEventListener("resize", handleResize);
  });
});
