export async function getCountriesFromApi() {
  const response = await fetch(
    'https://countriesnow.space/api/v0.1/countries/capital'
  );

  if (!response.ok) {
    throw new Error('Error al cargar la API');
  }

  const data = await response.json();

  return data.data;
}