document.addEventListener('DOMContentLoaded', function() {
  // Индексация элементов для поиска
  function indexElements() {
    const elementsToIndex = document.querySelectorAll('h1, h2, h3, p:not(:empty), li');
    let uniqueIdCounter = 0;
    elementsToIndex.forEach(element => {
      const textLength = element.textContent.trim().length;
      if (textLength > 5) {
        element.id = `searchable-${uniqueIdCounter++}`;
        const pageName = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);
        localStorage.setItem(element.id, pageName);
      }
    });
  }

  indexElements();

  // Прослушивание изменения языка и сброс поискового диалога
  document.addEventListener('languageChanged', function() {
    closeSearchDialog(); // Закрываем модальное окно поиска, если оно открыто
    removeHighlights(); // Удаляем все подсветки
    document.getElementById('searchResults').innerHTML = ''; // Очищаем результаты поиска
    document.getElementById('searchInput').value = ''; // Очищаем строку поиска
  });

  // Обработка якоря в URL (например, для прямой навигации к элементу)
  const anchorId = window.location.hash.substring(1);
  if (anchorId) {
    const targetElement = document.getElementById(anchorId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
});

function openSearchDialog() {
  document.getElementById('searchModal').style.display = 'flex';
}

function closeSearchDialog() {
  document.getElementById('searchModal').style.display = 'none';
}

function performSearch() {
  removeHighlights();
  const searchQuery = document.getElementById('searchInput').value.trim().toLowerCase();
  const resultsContainer = document.getElementById('searchResults');
  resultsContainer.innerHTML = '';
  if (!searchQuery) {
    resultsContainer.innerHTML = '<p>Введите запрос для поиска.</p>';
    return;
  }

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    const element = document.getElementById(key);
    if (element && element.textContent.toLowerCase().includes(searchQuery)) {
      highlightInElement(element, searchQuery);
      const link = document.createElement('a');
      link.href = `${value}#${key}`;
      link.innerHTML = highlightText(element.textContent, searchQuery);
      link.addEventListener('click', handleResultClick);
      const resultElement = document.createElement('li');
      resultElement.appendChild(link);
      resultsContainer.appendChild(resultElement);
    }
  }
}

function handleResultClick(event) {
  event.preventDefault();
  const url = new URL(this.href);
  if (window.location.pathname !== url.pathname) {
    window.location = this.href;
  } else {
    const targetId = url.hash.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    closeSearchDialog();
  }
}

function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function highlightText(text, query) {
  const escapedQuery = escapeRegExp(query);
  const regex = new RegExp(escapedQuery, 'gi');
  return text.replace(regex, match => `<span class="highlight">${match}</span>`);
}

function highlightInElement(element, query) {
  const innerHTML = element.innerHTML;
  const escapedQuery = escapeRegExp(query);
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  element.innerHTML = innerHTML.replace(regex, `<span class="highlight">$1</span>`);
}

function removeHighlights() {
  const highlightedItems = document.querySelectorAll('.highlight');
  highlightedItems.forEach(item => {
    const parent = item.parentNode;
    if (parent) {
      parent.innerHTML = parent.textContent;  // Восстановление текста без подсветки
    }
  });
}
