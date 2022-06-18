/**
 * makeNowPlayingLink brings together the api_key and page request parameters to form full link to resource
 * @param {string} base_url
 * @param {string} api_key - api key for authentication
 * @param {string} page - takes page number
 * @returns full link to `now playing` API resource
 */
function makeNowPlayingLink(base_url, api_key, page) {
    const NOW_PLAYING = "/movie/now_playing";
    return base_url + NOW_PLAYING + `?api_key=${api_key}&page=${page}`;
}

/**
 * makeSearchLink creates a link to request the queried movie search
 * @param {string} base_url
 * @param {string} api_key - api key for authentication
 * @param {string} query - search query
 * @param {int} page - response results' page number
 * @returns full link to search request specified by given parameters
 */
function makeSearchLink(base_url, api_key, query, page) {
    const SEARCH = "/search/movie";
    return base_url + SEARCH + `?api_key=${api_key}&query=${query}&page=${page}`;
} 

/**
 * showResults asynchronously grabs request items and appends them to the the movies grid
 * @param {string} api_key for authentication
 * @param {*} link - request link
 * @param {object} moviesGridElement - container element where response data will be added
 */
async function showResults(api_key, link, moviesGridElement) {
    const IMAGE_BASE_URL = "http://image.tmdb.org/t/p";
    const response = await fetch(link);
    const results = await response.json();

    for (let i = 0; i < results.results.length; i++) {
        if (results.results[i].poster_path) {
            moviesGridElement.innerHTML += `
            <div class="movie-card col-md-3 p-4 mb-2">
                    <img class="movie-poster img-fluid" 
                    src="${IMAGE_BASE_URL + "/w500" + results.results[i].poster_path + `?api_key=${api_key}`}" alt="${results.results[i].title}"/>
                    <p class="movie-votes">⭐ ${results.results[i].vote_average}</p>
                    <strong class="movie-title">${results.results[i].title}</strong>  
            </div>`
        }
    }
}

/**
 * addEventListeners has the side effect of adding data to the movies grid accordingly whenever certain events are triggered
 * @param {string} api_key for authentication
 * @param {string} base_url for the API
 * @param {object} moviesGridElement  - container where data is added
 */
function addEventListeners(api_key, base_url, moviesGridElement) {
    const loadMoreButton = document.querySelector("#load-more-movies-btn");
    const searchBar = document.querySelector('#search-input');
    const closeSearchButton = document.querySelector('#close-search-btn');

    let current_page = 1;
    let isSearch = false;

    searchBar.addEventListener('keyup', () => {
        if (searchBar.value != "") {
            isSearch = true;
            closeSearchButton.removeAttribute('hidden');
            moviesGridElement.innerHTML = "<p class='pl-3'>Search results for: " + `<em>${searchBar.value}</em>` + "</p>";
            showResults(api_key, makeSearchLink(base_url, api_key, searchBar.value, 1), moviesGridElement);
        } else {
            closeSearchButton.setAttribute('hidden', true);
            moviesGridElement.innerHTML = "<h1 class='pl-3'>Now Playing</h1>";
            showResults(api_key, makeNowPlayingLink(base_url, api_key, 1), moviesGridElement);
        }
    });

    searchBar.addEventListener('keypress', (event) => {
        if (searchBar.value != "" && event.key === "Enter") {
            event.preventDefault();
            isSearch = true;
            moviesGridElement.innerHTML = "Search results for: " + `<i>${searchBar.value}</i>`;
            showResults(api_key, makeSearchLink(base_url, api_key, searchBar.value, 1), moviesGridElement);
        }
    });

    loadMoreButton.addEventListener('click', () => {
        current_page += 1;
        if (isSearch) {
            showResults(api_key, makeSearchLink(base_url, api_key, searchBar.value, current_page), moviesGridElement);
        } else {
            showResults(api_key, makeNowPlayingLink(base_url, api_key, current_page), moviesGridElement);
        }
    });

    closeSearchButton.addEventListener('click', () => {
        searchBar.value = "";
        moviesGridElement.innerHTML = "<h1 class='pl-3'>Now Playing</h1>";
        showResults(api_key, makeNowPlayingLink(base_url, api_key, 1), moviesGridElement);
        closeSearchButton.setAttribute('hidden', true);
    });
}

window.onload = function() {
    // set constants
    const API_KEY = "05bb23a0660fedca2068eb99787a8b1a";
    const BASE_URL = "https://api.themoviedb.org/3";
    const moviesGrid = document.querySelector('#movies-grid');

    moviesGrid.innerHTML = "<h1 class='pl-3'>Now Playing</h1>";
    showResults(API_KEY, makeNowPlayingLink(BASE_URL, API_KEY, 1), moviesGrid);
    addEventListeners(API_KEY, BASE_URL, moviesGrid);
}