document.addEventListener("DOMContentLoaded", () => {
  const BREAKPOINT = 1200;
  const swiperInstances = [];
  let isSwiperActive = false;
  let resizeTimeout;

  function initSwipers() {
    const swipers = document.querySelectorAll(".swiper");

    swipers.forEach((container, index) => {
      if (swiperInstances[index]) {
        return;
      }

      try {
        swiperInstances[index] = new Swiper(container, {
          slidesPerView: 1,
          spaceBetween: 16,
          loop: true,
          pagination: {
            el: container.querySelector(".swiper-pagination"),
            clickable: true,
          },
          navigation: {
            nextEl: container.querySelector(".swiper-button-next"),
            prevEl: container.querySelector(".swiper-button-prev"),
          },
        });
      } catch (error) {}
    });
  }

  function destroySwipers() {
    swiperInstances.forEach((instance, index) => {
      if (instance && typeof instance.destroy === "function") {
        instance.destroy(true, true);
        swiperInstances[index] = null;
      }
    });
  }

  function checkScreenWidth() {
    const isDesktop = window.innerWidth >= BREAKPOINT;

    if (isDesktop && !isSwiperActive) {
      initSwipers();
      isSwiperActive = true;
    } else if (!isDesktop && isSwiperActive) {
      destroySwipers();
      isSwiperActive = false;
    }
  }

  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(checkScreenWidth, 150);
  }

  window.addEventListener("resize", handleResize);
  checkScreenWidth();

  window.addEventListener("beforeunload", () => {
    window.removeEventListener("resize", handleResize);
  });
});
