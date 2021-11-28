// import './css/styles.css';
import axios from 'axios';
import { Notify } from 'notiflix';

const BASE_URL = 'https://pixabay.com/api/?key=24425746-eb0b4891a5391949c89a37373';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
let page;
let inputValue;

searchForm.addEventListener('submit', onSubmit);
loadMoreButton.addEventListener('click', onLoadMoreClick);
loadMoreButton.style.display = 'none';

async function createRequest(inputValue, page) {
  const response = await axios.get(
    `${BASE_URL}&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`,
  );
  const images = await response.data;

  return images;
}

function onSubmit(event) {
  event.preventDefault();
  gallery.innerHTML = '';
  page = 1;
  inputValue = event.currentTarget.elements.searchQuery.value;
  if (!inputValue.trim()) {
    Notify.failure('Please, enter some word');
    return;
  }
  createRequest(inputValue, page).then(response => {
    console.log(response.totalHits);
    if (!response.totalHits) {
      loadMoreButton.style.display = 'none';
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }

    createMarkup(response);
    if (gallery.children.length >= response.totalHits) {
      loadMoreButton.style.display = 'none';
      Notify.info("We're sorry, but you've reached the end of search results.");
      return;
    }

    loadMoreButton.style.display = 'block';
  });
}

function onLoadMoreClick() {
  page += 1;
  createRequest(inputValue, page).then(response => {
    createMarkup(response);
    if (gallery.children.length >= response.totalHits) {
      loadMoreButton.style.display = 'none';
      Notify.info("We're sorry, but you've reached the end of search results.");
      return;
    }
  });
}

function createMarkup(images) {
  const cardMarkup = images.hits
    .map(image => {
      return `<div class="photo-card">
  <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes </b>${image.likes}
    </p>
    <p class="info-item">
      <b>Views </b>${image.views}
    </p>
    <p class="info-item">
      <b>Comments </b>${image.comments}
    </p>
    <p class="info-item">
      <b>Downloads </b>${image.downloads}
    </p>
  </div>
</div>`;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', cardMarkup);
}
