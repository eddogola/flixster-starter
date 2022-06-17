const API_KEY = "05bb23a0660fedca2068eb99787a8b1a";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "http://image.tmdb.org/t/p"

const NOW_PLAYING = "/movie/now_playing";
const SEARCH = "/search/movie";

const containerDiv = document.querySelector('.container');
const LoadMoreButton = document.querySelector("#load-more");
const searchBar = document.querySelector('#search-bar');
const searchButton = document.querySelector('#search-button');

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
            containerDiv.innerHTML += `
            <h3>${results.results[i].title}</h3>
            <img src="${IMAGE_BASE_URL + "/w500" + results.results[i].poster_path + `?api_key=${API_KEY}`}" alt="${results.results[i].title}"/>
            <span>${results.results[i].vote_count}</span>`
        }
    }
}

var isSearch = false;

function addEventListeners() {
    var current_page = 1;

    searchBar.addEventListener('keyup', () => {
        if (searchBar.value != "") {
            isSearch = true;
            containerDiv.innerHTML = "";
            showResults(makeSearchLink(searchBar.value, 1));
        }
    });

    LoadMoreButton.addEventListener('click', () => {
        current_page += 1;
        if (isSearch) {
            showResults(makeSearchLink(searchBar.value, current_page));
        } else {
            showResults(makeNowPlayingLink(current_page))
        }
    });
}

window.onload = function() {
    showResults(makeNowPlayingLink(1));
    addEventListeners();
}