import { getAllCountries } from '../../services/api.js';

let allCountries = [];

const searchInput = document.getElementById('searchInput');
const regionFilter = document.getElementById('regionFilter');
const sortSelect = document.getElementById('sortSelect');
const mundialFilter = document.getElementById('mundialFilter');
const countriesGrid = document.getElementById('countriesGrid');
const resultsCount = document.getElementById('resultsCount');
const loader = document.getElementById('loader');
const errorMessage = document.getElementById('errorMessage');

function showLoader() {
  loader.classList.remove('hidden');
  countriesGrid.classList.add('hidden');
  errorMessage.classList.add('hidden');
}

function hideLoader() {
  loader.classList.add('hidden');
  countriesGrid.classList.remove('hidden');
}

function showError(msg) {
  errorMessage.textContent = msg;
  errorMessage.classList.remove('hidden');
  countriesGrid.innerHTML = '';
  resultsCount.textContent = '';
}

async function loadCountries() {
  showLoader();

  try {
    allCountries = await getAllCountries();
    hideLoader();
    applyFiltersAndRender();
  } catch (error) {
    hideLoader();
    showError('No se pudieron cargar los países.');
    console.error(error);
  }
}

function applyFiltersAndRender() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const region = regionFilter.value;
  const mundial = mundialFilter.value;
  const sortValue = sortSelect.value;

  let result = [...allCountries];

  if (searchTerm) {
    result = result.filter(country =>
      country.name.toLowerCase().includes(searchTerm)
    );
  }

  if (region) {
    result = result.filter(country =>
      country.region.toLowerCase() === region.toLowerCase()
    );
  }

  if (mundial === 'si') {
    result = result.filter(country => country.clasificado2026);
  }

  if (mundial === 'no') {
    result = result.filter(country => !country.clasificado2026);
  }

  switch (sortValue) {
    case 'name-asc':
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;

    case 'name-desc':
      result.sort((a, b) => b.name.localeCompare(a.name));
      break;

    case 'population-asc':
      result.sort((a, b) => a.participaciones - b.participaciones);
      break;

    case 'population-desc':
      result.sort((a, b) => b.participaciones - a.participaciones);
      break;
  }

  renderCountries(result);
}

function renderCountries(countries) {
  countriesGrid.innerHTML = '';

  if (countries.length === 0) {
    countriesGrid.innerHTML = `
      <p class="empty-state">
        No se encontraron selecciones.
      </p>
    `;
    return;
  }

  resultsCount.textContent =
    `${countries.length} selección(es) encontrada(s)`;

  countries.forEach(country => {
    const card = document.createElement('div');

    card.className = 'country-card';

    card.innerHTML = `
      <div class="country-card-body">
        <h3>${country.name}</h3>

        <p>🏛 Capital: ${country.capital}</p>

        <p>🌍 Región: ${country.region}</p>

        <p>⚽ Clasificado 2026:
          ${country.clasificado2026 ? 'Sí' : 'No'}
        </p>

        <p>🏆 Títulos: ${country.titulos}</p>

        <p>📅 Participaciones: ${country.participaciones}</p>

        <a
          class="btn-detalle"
          href="/src/pages/country-detail/index.html?code=${country.code}"
        >
          Ver detalle →
        </a>
      </div>
    `;

    countriesGrid.appendChild(card);
  });
}

searchInput.addEventListener('input', applyFiltersAndRender);
regionFilter.addEventListener('change', applyFiltersAndRender);
sortSelect.addEventListener('change', applyFiltersAndRender);
mundialFilter.addEventListener('change', applyFiltersAndRender);

loadCountries();