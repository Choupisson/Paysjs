// Récupération des éléments du DOM
const countriesContainer = document.getElementById('countries-container');
const searchInput = document.getElementById('search-input');
const regionFilter = document.getElementById('region-filter');

let allCountries = []; // Stockage des données de tous les pays

function displayCountries(countries) {
    countriesContainer.innerHTML = countries.map(country => `
        <div class="country" data-country='${encodeURIComponent(JSON.stringify(country))}'>
            <img src="${country.flags.svg || country.flags.png}" alt="Flag of ${country.name.common}">
            <h3>${country.name.common}</h3>
            <p>Population: ${country.population.toLocaleString()}</p>
            <p>Region: ${country.region}</p>
            <p>Capital: ${country.capital || 'N/A'}</p>
        </div>
    `).join('');
}


// Ajout d'un écouteur d'événements pour afficher les détails du pays lorsqu'un pays est cliqué
countriesContainer.addEventListener('click', function(event) {
    const countryCard = event.target.closest('.country');
    if (countryCard) {
        try {
            const countryData = JSON.parse(decodeURIComponent(countryCard.getAttribute('data-country')));
            showCountryDetails(countryData);
        } catch (error) {
            console.error('Error parsing country data:', error);
        }
    }
});


// Fonction pour afficher les détails du pays
function showCountryDetails(country) {
    const detailsHtml = `
        <div class="country-details">
            <button onclick="goBack()" style="position: fixed; bottom: 10px; left: 50%; transform: translateX(-50%);">Retour</button>
            <img src="${country.flags.svg || country.flags.png}" alt="Flag of ${country.name.common}">
            <h2>${country.name.common}</h2>
            <p>Native Name: ${Object.values(country.name.nativeName)[0].common || 'N/A'}</p>
            <p>Population: ${country.population.toLocaleString()}</p>
            <p>Region: ${country.region}</p>
            <p>Sub Region: ${country.subregion || 'N/A'}</p>
            <p>Capital: ${country.capital || 'N/A'}</p>
            <p>Top Level Domain: ${country.topLevelDomain ? country.topLevelDomain.join(', ') : 'N/A'}</p>
            <p>Currencies: ${country.currencies ? Object.values(country.currencies).map(c => `${c.name} (${c.symbol})`).join(', ') : 'N/A'}</p>
            <p>Languages: ${
                country.languages ? Object.entries(country.languages).map(([code, name]) => `${name} (${code})`).join(', ') : 'N/A'
            }</p>
        </div>
    `;
    countriesContainer.innerHTML = detailsHtml;
}



function goBack() {
    displayCountries(allCountries);
}


// Fonction asynchrone pour récupérer les données des pays depuis l'API
async function fetchCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allCountries = await response.json();
        displayCountries(allCountries);
    } catch (e) {
        console.error(e);
        countriesContainer.innerHTML = `<p>Une erreur s'est produite lors du chargement des pays.</p>`;
    }
}


// Fonction pour filtrer les pays par le texte de recherche
function searchCountries(event) {
    const text = event.target.value.toLowerCase();
    const filtered = allCountries.filter(country => country.name.common.toLowerCase().includes(text));
    displayCountries(filtered);
}

// Fonction pour filtrer les pays par région
function filterByRegion(event) {
    const region = event.target.value;
    if (region === "") {
        displayCountries(allCountries);
    } else {
        const filtered = allCountries.filter(country => country.region === region);
        displayCountries(filtered);
    }
}

// Ajout des écouteurs d'événements sur les éléments de recherche et de filtrage

searchInput.addEventListener('input', searchCountries);
regionFilter.addEventListener('change', filterByRegion);

// Appel initial pour charger tous les pays
fetchCountries();



// il y a des pays qui ne fonctionne pas. J'obtiens cette erreur : 
//Error parsing country data: SyntaxError: Unterminated string in JSON at position 3011 (line 1 column 3012)
//il semblerait que parfois, le texte JSON que j'essaie de convertir en objet JavaScript est mal formé

//De plus, lorsqu'on clique sur certain pays, leur taille varie sans que je ne sache pourquoi.

// je n'ai pas réussis à trouver la solution pour corriger ces erreurs.
