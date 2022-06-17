const API_KEY = "05bb23a0660fedca2068eb99787a8b1a";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "http://image.tmdb.org/t/p"

const NOW_PLAYING = "/movie/now_playing";
const SEARCH = "/search/movie";

const moviesGrid = document.querySelector('#movies-grid');
const loadMoreButton = document.querySelector("#load-more-movies-btn");
const searchBar = document.querySelector('#search-input');
const closeSearchButton = document.querySelector('#close-search-btn');

function makeNowPlayingLink(page) {
    return BASE_URL + NOW_PLAYING + `?api_key=${API_KEY}&page=${page}`;
}

function makeSearchLink(query, page) {
    return BASE_URL + SEARCH + `?api_key=${API_KEY}&query=${query}&page=${page}`;
} 

async function showResults(link) {
    const response = await fetch(link);
    const results = await response.json();

    for (let i = 0; i < results.results.length; i++) {
        if (results.results[i].poster_path) {
            moviesGrid.innerHTML += `
            <div class="movie-card>
                <h3 class="movie-title">${results.results[i].title}</h3>
                <img class="movie-poster" 
                src="${IMAGE_BASE_URL + "/w500" + results.results[i].poster_path + `?api_key=${API_KEY}`}" alt="${results.results[i].title}"/>
                <span class="movie-votes">${results.results[i].vote_average}</span>
            </div>`
        }
    }
}

var isSearch = false;

function addEventListeners() {
    var current_page = 1;

    searchBar.addEventListener('keyup', () => {
        if (searchBar.value != "") {
            isSearch = true;
            closeSearchButton.removeAttribute('hidden');
            moviesGrid.innerHTML = "";
            showResults(makeSearchLink(searchBar.value, 1));
        } else {
            closeSearchButton.setAttribute('hidden', true);
        }
    });

    searchBar.addEventListener('keypress', (event) => {
        if (searchBar.value != "" && event.key === "Enter") {
            event.preventDefault();
            isSearch = true;
            moviesGrid.innerHTML = "";
            showResults(makeSearchLink(searchBar.value, 1));
        }
    });

    loadMoreButton.addEventListener('click', () => {
        current_page += 1;
        if (isSearch) {
            showResults(makeSearchLink(searchBar.value, current_page));
        } else {
            showResults(makeNowPlayingLink(current_page))
        }
    });

    closeSearchButton.addEventListener('click', () => {
        searchBar.value = "";
        moviesGrid.innerHTML = "";
        showResults(makeNowPlayingLink(1));
    });
}

window.onload = function() {
    showResults(makeNowPlayingLink(1));
    addEventListeners();
}