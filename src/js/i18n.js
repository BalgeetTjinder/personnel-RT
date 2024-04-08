document.addEventListener("DOMContentLoaded", function () {
  const changeLanguage = (lang) => {
    document.documentElement.setAttribute("lang", lang);
    fetch(`locales/${lang}.json`)
      .then((response) => response.json())
      .then((translations) => {
        document.querySelectorAll("[data-i18n]").forEach((el) => {
          const key = el.getAttribute("data-i18n");
          el.textContent = translations[key] || "Undefined";

          if (el.classList.contains("info__toggle-btn")) {
            const isExpanded = document
              .getElementById("infoText")
              .classList.contains("info__text--expanded");
            el.textContent = isExpanded
              ? translations["info.toggleLess"]
              : translations["info.toggleMore"];
          }
        });
      });
  };

  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", function () {
      const lang = this.getAttribute("data-lang");
      changeLanguage(lang);
    });
  });
});
