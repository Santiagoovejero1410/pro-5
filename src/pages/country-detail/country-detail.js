import { getCountryByCode } from '../../services/api.js';

const loader = document.getElementById('loader');
const errorMessage = document.getElementById('errorMessage');
const countryDetail = document.getElementById('countryDetail');
const btnVolver = document.getElementById('btnVolver');

btnVolver.addEventListener('click', () => {
  window.history.back();
});

function showLoader() {
  loader.classList.remove('hidden');
  countryDetail.classList.add('hidden');
  errorMessage.classList.add('hidden');
}

function hideLoader() {
  loader.classList.add('hidden');
}

function showError(msg) {
  errorMessage.textContent = msg;
  errorMessage.classList.remove('hidden');
}

async function loadCountryDetail() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');

  if (!code) {
    showError('No se especificó ninguna selección.');
    return;
  }

  showLoader();

  try {
    const country = await getCountryByCode(code);

    if (!country) {
      throw new Error();
    }

    hideLoader();
    renderDetail(country);
  } catch (error) {
    hideLoader();
    showError('No se pudo cargar la información.');
  }
}

function renderDetail(country) {
  const badgeText = country.clasificado2026
    ? '⚽ Clasificado al Mundial 2026'
    : '❌ No clasificado al Mundial 2026';

  countryDetail.innerHTML = `
    <div class="detail-body">

      <h2>${country.name}</h2>

      <span class="badge-clasificado">
        ${badgeText}
      </span>

      <div class="detail-grid">

        <div class="detail-item">
          <span>🏛 Capital</span>
          <span>${country.capital}</span>
        </div>

        <div class="detail-item">
          <span>🌍 Región</span>
          <span>${country.region}</span>
        </div>

        <div class="detail-item">
          <span>📅 Participaciones</span>
          <span>${country.participaciones}</span>
        </div>

        <div class="detail-item">
          <span>🏆 Títulos</span>
          <span>${country.titulos}</span>
        </div>

        <div class="detail-item">
          <span>🥇 Mejor resultado</span>
          <span>${country.mejorResultado}</span>
        </div>

        <div class="detail-item">
          <span>🔤 Código FIFA</span>
          <span>${country.code}</span>
        </div>

      </div>

    </div>
  `;

  countryDetail.classList.remove('hidden');
  document.title = `${country.name} - Mundial 2026`;
}

loadCountryDetail();