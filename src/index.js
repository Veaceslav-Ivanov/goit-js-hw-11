import './css/styles.css';
import API from './fetchCountries.js';
import { debounce, max } from 'lodash';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;
const MAX_RESPONSE = 10;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch() {
  let inputData = searchBox.value.toLowerCase().trim();
  if (!inputData) {
    clearMarkup();
    return;
  }
  API.fetchCountries(inputData).then(response => {
    if (response.length > MAX_RESPONSE) {
      Notify.info('Too many matches found. Please enter a more specific name.');
      clearMarkup();
      return;
    }
    createList(response);
  });
}

function createList(countries) {
  if (countries.length === 1) {
    const countryData = countries.map(({ name, capital, population, flags, languages }) => {
      return `<img src="${flags.svg}" alt="" width="280px">
    <h2 class="country-title">${name}</h2>
    <p class="country-description">Capital: <span class="description-span">${capital}</span></p>
    <p class="country-description">Population: <span class="description-span">${population}</span></p>
    <p class="country-description">Languages: <span class="description-span">${languages.map(
      ({ name }) => name,
    )}</span></p>`;
    });
    countryInfo.innerHTML = countryData;
    countryList.innerHTML = '';
    return;
  }
  const listMarkup = countries
    .map(({ name, flags }) => {
      return `<li class="country-item">
      <img src="${flags.svg}" alt="" width="40px">
      <p class="country-item-text">${name}</p>
    </li>`;
    })
    .join('');
  countryList.innerHTML = listMarkup;
  countryInfo.innerHTML = '';
}

function clearMarkup() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
