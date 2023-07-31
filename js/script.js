const api = "https://www.omdbapi.com/";
const api_key = "2c8877ec";

let favoriteList = [];
const movies_grid = document.getElementById("movies-grid");
const searchBar = document.getElementById("search");
const movieGrid = document.getElementById("movies-grid");
const wishlist = document.getElementById("wishlist");
let favouritesI = document.getElementById("favorites");

wishlist.addEventListener('click', showFavorites);

// to search for movies on putting input
async function searchMovies(searchTerm){
    const URL = `${api}?s=${searchTerm}&apikey=${api_key}`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    if(data.Response == "True"){
        showMovies(data.Search);
    }
}

//to get input from text box and pass it to search from API
function loadMovies(){
    var searchTerm = searchBar.value;
    searchMovies(searchTerm);
}

//display the movies from which user can select 
function showMovies(moviesList){
    movieGrid.innerHTML = "";
    for(let i=0; i < moviesList.length; i++){
        let movieItem = document.createElement("li");
        movieItem.dataset.id = moviesList[i].imdbID;
        let poster = "img/notFound.png";
        if(moviesList[i].Poster != "N/A"){
            poster = moviesList[i].Poster;
        }
        movieItem.innerHTML = `
            <div id="${moviesList[i].imdbID}" class="movie-poster">
                <h3>${moviesList[i].Title}</h3> <br><img src="${poster}" class="movie-poster" />
            </div>
            <div class="btn-div">
                <button class="wishlist-btn" id="${moviesList[i].imdbID}" onclick=addWishlist(this)>Add to Wishlist</button>
            </div>
        `;

        movieGrid.appendChild(movieItem);

    }
    showDetails("movies");
}

//get the id of selected movie and pass it to get the details of that id from API
function showDetails(caller){
    const movieDetails = document.querySelectorAll(".movie-poster");
    movieDetails.forEach(movie => {
        movie.addEventListener("click",async () =>{
            const result = await fetch(`${api}?i=${movie.id}&apikey=${api_key}`);
            const details = await result.json();
            if(details.Response == "True"){
                displayMovieDetails(details, caller);
            }
        })
    })

}


//display the detials of selected id
function displayMovieDetails(details, caller){
    let myBtn = `<button id="${details.imdbID}" onclick="removeFromWishlist(this)">Remove from Wishlist</button>`;
    if(caller == "movies"){
        myBtn = `<button id="${details.imdbID}" onclick="addWishlist(this)">Add to Wishlist</button>`;
    }
    movieGrid.innerHTML = `
    <li class="poster flex">
        <div class="movie-poster">
            <img src = "${(details.Poster != "N/A") ? details.Poster : "img/notFound.png"}" alt = "poster of movie">
        </div>
        <div class = "movie-info flex">
            <div class="container">
                <h2 class = "movie-title">${details.Title}</h2>
                <div class = "year">Year: ${details.Year}</div>
                <div class = "rated">Ratings: ${details.Rated}</div>
                <div class = "released">Released: ${details.Released}</div>
                <div class = "genre"><b>Genre:</b> ${details.Genre}</div>
                <div class = "writer"><b>Writer:</b> ${details.Writer}</div>
                <div class = "actors"><b>Actors: </b>${details.Actors}</div>
                <div class = "plot"><b>Plot:</b> ${details.Plot}</div>
                <div class = "language"><b>Language:</b> ${details.Language}</div>
                <div class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</div>
                
                <div>
                    ${myBtn}
                </div> 
            </div>
            
        </div>
    </li>
    `;
}

//add the id to wishlist array
function addWishlist(element){
    for (let i = 0; i < favoriteList.length; i++){
        if (favoriteList[i] == element.id) {
           alert("Already in Favourite List");
           return;
        }
    }
    favoriteList.push(element.id);
    alert("added");
}


//remove the id from wishlist array
function removeFromWishlist(movie){
    let index = favoriteList.indexOf(movie.id);
    if (index > -1) {
        favoriteList.splice(index, 1);
    }
    console.log(favoriteList.length);
    printFavourites();
}

//to display the wishlist grid wise
function printFavourites(){
    movieGrid.innerHTML = "";
    if(favoriteList.length == 0){
        favouritesI.style.display = "block";
    }
    else{
        favoriteList.forEach(async movie => {
            const result = await fetch(`${api}?i=${movie}&apikey=${api_key}`);
            const details = await result.json();
            if(details.Response == "True"){
                let movieItem = document.createElement("li");
                movieItem.dataset.id = movie;
                let poster = "img/notFound.png";
                if(details.Poster != "N/A"){
                    poster = details.Poster;
                }
                movieItem.innerHTML = `
                    <div id="${details.imdbID}" class="movie-poster">
                        <h3>${details.Title}</h3> <br><img src="${poster}" class="movie-poster" />
                    </div>
                    <div class="btn-div">
                        <button class="wishlist-btn" id="${details.imdbID}" onclick=removeFromWishlist(this)>Remove from Wishlist</button>
                    </div>
                `;
                movieGrid.appendChild(movieItem);
            }

        })
        showDetails("wishlist");
    }
}

//preventing default click and setting off to show the wishlist 
function showFavorites(event){
    event.preventDefault();
    printFavourites();
}






