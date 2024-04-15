document.addEventListener("DOMContentLoaded", function () {
  const changeLanguage = (lang) => {
    document.documentElement.setAttribute("lang", lang);
    localStorage.setItem('selectedLanguage', lang);
    fetch(`locales/${lang}.json`)
      .then((response) => response.json())
      .then((translations) => {
        document.querySelectorAll("[data-i18n]").forEach((el) => {
          const key = el.getAttribute("data-i18n");
          if (el.firstChild) {
            el.firstChild.nodeValue = translations[key] || "Undefined";
          }
          if (el.classList.contains("info__toggle-btn")) {
            const isExpanded = document.getElementById("infoText").classList.contains("info__text--expanded");
            el.textContent = isExpanded ? translations["info.toggleLess"] : translations["info.toggleMore"];
          }
        });

        document.querySelectorAll("input[placeholder], textarea[placeholder]").forEach((input) => {
          const placeholderKey = `placeholder.${input.name}`;
          input.placeholder = translations[placeholderKey] || input.placeholder;
        });

        reIndexElements();

        // Отправка события после всех обновлений
        document.dispatchEvent(new CustomEvent('languageChanged'));
      });
  };

  // Попытка установить язык из localStorage при загрузке страницы
  const savedLanguage = localStorage.getItem('selectedLanguage');
  if (savedLanguage) {
    changeLanguage(savedLanguage);
  } else {
    changeLanguage('defaultLang'); // Установка языка по умолчанию, если в localStorage ничего не найдено
  }

  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", function () {
      const lang = this.getAttribute("data-lang");
      changeLanguage(lang);
    });
  });

  function reIndexElements() {
    const elementsToIndex = document.querySelectorAll('h1, h2, h3, p:not(:empty), li');
    // Очищаем только данные индексации, а не все данные localStorage
    elementsToIndex.forEach(element => {
      const textLength = element.textContent.trim().length;
      if (textLength > 5) {
        const uniqueId = `searchable-${element.textContent.trim().hashCode()}`; // Генерация уникального ID на основе текста
        element.id = uniqueId;
        const pageName = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);
        localStorage.setItem(uniqueId, pageName);
      }
    });
  }

  reIndexElements();
  document.dispatchEvent(new CustomEvent('languageChanged')); // Отправка события смены языка
});

// Простая функция для создания хэша из строки
String.prototype.hashCode = function() {
    var hash = 0, i, chr;
    for (i = 0; i < this.length; i++) {
      chr   = this.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Преобразование в 32bit целое число
    }
    return hash;
};
