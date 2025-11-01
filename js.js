document.addEventListener("DOMContentLoaded", () => {
  // Проверка наличия Swiper библиотеки
  if (typeof Swiper === "undefined") {
    console.error(
      "Swiper.js не загружен. Убедитесь, что библиотека подключена."
    );
    return;
  }

  const BREAKPOINT = 1200;
  const RESIZE_DEBOUNCE = 150;
  const swiperInstances = [];
  let isSwiperActive = false;
  let resizeTimeout;

  /**
   * Инициализирует все слайдеры на странице
   */
  function initSwipers() {
    const swipers = document.querySelectorAll(".swiper");

    swipers.forEach((container, index) => {
      // Пропускаем, если слайдер уже инициализирован
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
        console.error(`Ошибка при инициализации Swiper #${index + 1}:`, error);
      }
    });
  }

  /**
   * Уничтожает все инициализированные слайдеры
   */
  function destroySwipers() {
    swiperInstances.forEach((instance, index) => {
      if (instance && typeof instance.destroy === "function") {
        try {
          instance.destroy(true, true);
        } catch (error) {
          console.error(`Ошибка при уничтожении Swiper #${index + 1}:`, error);
        }
        swiperInstances[index] = null;
      }
    });
    swiperInstances.length = 0;
  }

  /**
   * Проверяет ширину экрана и управляет состоянием слайдеров
   * Избегает повторной инициализации/уничтожения, если состояние уже соответствует условию
   */
  function checkScreenWidth() {
    const isDesktop = window.innerWidth >= BREAKPOINT;

    // Инициализируем только если экран >= BREAKPOINT и слайдеры еще не активны
    if (isDesktop && !isSwiperActive) {
      initSwipers();
      isSwiperActive = true;
    }
    // Уничтожаем только если экран < BREAKPOINT и слайдеры активны
    else if (!isDesktop && isSwiperActive) {
      destroySwipers();
      isSwiperActive = false;
    }
    // Если состояние уже соответствует условию, ничего не делаем (избегаем повторных действий)
  }

  /**
   * Обработчик изменения размера окна с debounce
   */
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      checkScreenWidth();
    }, RESIZE_DEBOUNCE);
  }

  // Инициализация при загрузке страницы
  checkScreenWidth();

  // Обработчик изменения размера окна
  window.addEventListener("resize", handleResize);

  // Очистка при выгрузке страницы
  window.addEventListener("beforeunload", () => {
    destroySwipers();
    window.removeEventListener("resize", handleResize);
    clearTimeout(resizeTimeout);
  });
});
