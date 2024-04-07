document.addEventListener("DOMContentLoaded", function() {
  const changeLanguage = (lang) => {
      fetch(`locales/${lang}.json`)
          .then(response => response.json())
          .then(translations => {
              document.querySelectorAll("[data-i18n]").forEach(el => {
                  const key = el.getAttribute("data-i18n");
                  el.textContent = translations[key] || "Undefined";
              });
          });
  };

  // Добавьте событие клика на элементы управления языком
  document.querySelectorAll('[data-lang]').forEach(button => {
      button.addEventListener('click', function() {
          const lang = this.getAttribute('data-lang');
          changeLanguage(lang);
      });
  });
});
