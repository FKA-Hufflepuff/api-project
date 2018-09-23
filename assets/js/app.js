//////////// Global Vars /////////////////
$(document).ready(() => {
    $('.mastheadAfterMood').hide()
})
const tmdbAPIkey = 'c20ca68e2a577a2aebe1461e51d16a32';
const omdbAPIkey = '8a053050'
let moodIndex = 0;
let yourMood = {};
let movieList = [];
let movieTitles = [];
let carouselLoaded = false;
let players = [{}, {}, {}, {}, {}, {}]
let allGenres = [28, 12, 16, 35, 80, 99, 18, 10751, 14, 36, 27, 10402, 9648, 10749, 878, 10770, 53, 10752, 37]
let youtubeAPIReady = false;
let moodWord = '';

//////////////// Mood Profile Construction 
function MoodProfile(moodEnglish, moodIndex, genreIds, plotWords) {
    this.english = moodEnglish;
    this.index = moodIndex;
    this.genres = genreIds;
    this.plotWords = plotWords;
}

const happy = new MoodProfile('happy', 0, [16, 35, 10751], ['friends', 'family', 'celebration', 'comedy', 'funny'])
const sad = new MoodProfile('sad', 1, [18, 9648, 10749], ['dark', 'tragic', 'lonely', 'loss', 'death', 'dying', 'dead', 'cry'])
const mad = new MoodProfile('mad', 2, [28, 53, 10752], ['cruel', 'angry', 'ruin', 'anger', 'mad', 'madness', 'violence', 'fight'])
const lonely = new MoodProfile('lonely', 3, [99, 878, 10749], ['dystopian', 'heartbroken', 'personal', 'lonely', 'loss', 'heartbreak', 'seperation', 'break-up', 'abandon', 'alone', 'love'])
const inLove = new MoodProfile('inLove', 4, [12, 35, 10749], ['magical', 'charming', 'love', 'romance', 'romantic', 'wedding', 'marriage', 'boyfriend', 'girlfriend'])
const silly = new MoodProfile('silly', 5, [35, 14, 10402], ['exciting', 'outrageous', 'laughter', 'satire', 'comedy', 'wild', 'high jinks', 'mockumentary', 'funny', 'laughter', 'party', 'scheme'])
const random = new MoodProfile('random', 6, _.sample(allGenres, 3), null)

const moodObjectArray = [happy, sad, mad, lonely, inLove, silly, random]
const moodStringArray = moodObjectArray.map(x => x.english)


///////////////////////////////////////


///////////// Load iFrame API Asynchronously 
let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
$(tag).insertBefore($('script:first'))

function onYouTubeIframeAPIReady() {
    youtubeAPIReady = true;
}
/////////////////////////////////////////////////

//////////////// Places iFrames into Carousel
const carouselFiller = (index, movieList) => {

    movieTitles = movieList.map(x => x.title);
    $(`#slide${index}`).addClass('active');
    $(`#slide${index}`).siblings().removeClass('active');
    $(`#carouselIndicator${index}`).addClass('active');
    $(`#carouselIndicator${index}`).siblings().removeClass('active')
    if (carouselLoaded === false) {
        $('#carouselContainer').show();
        $('.carousel').carousel('pause')
        for (let i = 0; i < 6; i++) {
            const onPlayerReady = (event) => {
                $('#videoCarousel').on('slide.bs.carousel', () => {
                    event.target.pauseVideo()
                })
                event.target.cuePlaylist({
                    listType: 'search',
                    list: movieTitles[i] + ' trailer'
                })
            }
            players[i] = new YT.Player(`moodMovie${i}`, {
                height: '360',
                width: '640',
                videoId: '',
                playerVars: {
                    listType: 'search',
                    list: '',
                    suggestedQuality: 'large'
                },
                events: {
                    'onReady': onPlayerReady
                }
            })
        }
        carouselLoaded = true;
    } else {
        for (let i = 0; i < 6; i++) {
            players[i].cuePlaylist({
                listType: 'search',
                list: movieTitles[i] + ' trailer'
            })
        }
    }
}
////////////////////////

//////////////////////// Get IMDB IDs

const imdbIdGetter = (movieList) => {
    let imdbUrl = '';
    for (let i = 0; i < movieList.length; i++) {
        imdbUrl = `http://omdbapi.com/?apikey=${omdbAPIkey}&t=${movieList[i].title}`
        $.get(imdbUrl).then((response) => {
            if (response.Response === 'True') {
                $(`#card${i}`).append(`<a href="https://www.imdb.com/title/${response.imdbID}" target="_blank" class="btn btn-warning imdbBtn">IMDb</a>`)
            }
        })
    }
}

////////////////////////


///////////////////// Creates movie cards

const cardGenerator = (movieList) => {
    $('#cardsGoHere').empty();
    $('#cardsGoHere').append('<div class="container" id="cardContainer">')
    $('#cardContainer').append('<div class="row" id="movieCards1">')
    for (let cardIndex = 0; cardIndex < movieList.length; cardIndex++) {
        let movieObject = $(`<div class="col-lg-2 col-md-4 col-sm-6 col-xs-12 mx-auto" id="card${cardIndex}">`)
        let poster = $(`<div id="moodMovie${cardIndex}">` + `<img class="moviePoster img-thumbnail img-fluid" src="http://image.tmdb.org/t/p/w185/${movieList[cardIndex].poster_path}">`)
        let movieInfo = $(`<h5>${movieList[cardIndex].title}</h5>`)
        let trailerBtn = $(`<div id="btnGroup${cardIndex}" class="btn-group" role="group"><button type="button" class="btn btn-secondary"><i class="fa fa-film" aria-hidden="true"></i></button></div>`)
        $('#movieCards1').append(movieObject)
        $(`#card${cardIndex}`).append(poster, movieInfo, trailerBtn)
        $(`#btnGroup${cardIndex}`).click(() => {
            $('.moviePoster').hide()
            $('#carouselContainer').show();
            carouselFiller(cardIndex, movieList);
        })
    }
    imdbIdGetter(movieList);
}
/////////////////////////

//////////////////// Check plots for keywords 
const checkPlots = (allMovies, plots, mood) => {
    let allApplicableMovies = []
    for (let plotIndex = 0; plotIndex < plots.length; plotIndex++) {
        for (let wordIndex = 0; wordIndex < mood.plotWords.length; wordIndex++) {
            if (plots[plotIndex].includes(mood.plotWords[wordIndex])) {
                allApplicableMovies.push(allMovies[plotIndex])
            }
        }
        if (plotIndex === plots.length - 1) {
            movieList = _.sample(_.uniq(allApplicableMovies), 6)
            cardGenerator(movieList);
        }
    }
}
//////////////////////////////////

////////////////////// Grabs movies by genre
const manyRandomMovies = (yourMood) => {
    let arrayOfMovieArrays = [];
    let allMovies = [];
    let allPlots = [];
    for (let page = 1; page <= 40; page++) {
        let moodQueryUrl = `https://api.themoviedb.org/3/discover/movie?with_original_language=en&with_genres=${yourMood.genres[0]}|${yourMood.genres[1]}|${yourMood.genres[2]}&page=${page}&include_adult=false&language=en-US&api_key=${tmdbAPIkey}`;
        $.get(moodQueryUrl).then((response) => {
            arrayOfMovieArrays.push(response.results)
            if (arrayOfMovieArrays.length === 40) {
                allMovies = _.flatten(arrayOfMovieArrays);
                ////// Skips plots for random button ////////
                if (!yourMood.plotWords) {
                    movieList = _.sample(_.uniq(allMovies), 6);
                    cardGenerator(movieList);
                } else {
                    allPlots = _.pluck(allMovies, 'overview');
                    checkPlots(allMovies, allPlots, yourMood);
                }
            }
            if (!response) {
                console.log('error')
            }
        })
    }
}
////////////////////


/////////////////////// Mood selection
$('.moodButtons').click(function () {
    $('#carouselContainer').hide()
    $('#soloMovie').hide()
    movieList = [];
    moodWord = $(this).attr('mood')
    moodIndex = moodStringArray.indexOf(moodWord);
    let yourMood = moodObjectArray[moodIndex]
    manyRandomMovies(yourMood);
    $('.cover-heading').hide()
    $('.mastheadAfterMood').show()
})