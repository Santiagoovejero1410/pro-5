export async function getAllCountries() {
  const response = await fetch('/worldcupTeams.json');

  if (!response.ok) {
    throw new Error('No se pudieron cargar los datos');
  }

  return await response.json();
}

export async function getCountryByCode(code) {
  const countries = await getAllCountries();

  return countries.find(
    country => country.code === code
  );
}