document.getElementById('toggleText').addEventListener('click', function() {
    const infoText = document.getElementById('infoText');
    const isExpanded = infoText.classList.toggle('info__text--expanded');
    const currentLang = document.documentElement.lang;
    const textSpan = this.querySelector('span[data-i18n="info.toggleMore"]');
    const icon = this.querySelector('i'); 
  
    if (isExpanded) {
      icon.className = 'fas fa-chevron-up';
    } else {
      icon.className = 'fas fa-chevron-down';
    }
  
    fetch(`locales/${currentLang}.json`)
        .then(response => response.json())
        .then(translations => {
            textSpan.textContent = isExpanded ? translations["info.toggleLess"] : translations["info.toggleMore"];
        });
  });
  