//////////// Global Vars /////////////////

const tmdbAPIkey = 'c20ca68e2a577a2aebe1461e51d16a32';
let moodIndex = 0;
let yourMood = {};
let movieList = [];
let movieTitles = [];
let carouselLoaded = false;
let player0 = {};
let player1 = {};
let player2 = {};
let player3 = {};
let player4 = {};
let player5 = {};
let players = [player0, player1, player2, player3, player4, player5]
let youtubeAPIReady = false;
let moodWord = '';
$('.mastheadAfterMood').hide()
function onYouTubeIframeAPIReady() {
    youtubeAPIReady = true;
}



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

const moodObjectArray = [happy, sad, mad, lonely, inLove, silly]
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
                    list: ''
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

///////////////////// Creates movie cards
const cardGenerator = (movieList) => {
    $('#cardsGoHere').empty();
    $('#cardsGoHere').append('<div class="container" id="cardContainer">')
    $('#cardContainer').append('<div class="card-deck" id="movieCards1">')
    for (let cardIndex = 0; cardIndex < movieList.length; cardIndex++) {        let card = $(`<div class="card" id="card${cardIndex}">`)
        let cardTop = $(`<div id="moodMovie${cardIndex}">` + `<img class="card-img-top" src="http://image.tmdb.org/t/p/w185/${movieList[cardIndex].poster_path}">`)
        let cardBody = $(`<div class="card-body">`)
        let cardTitle = $(`<h5 class="card-text">${movieList[cardIndex].title}</h5><p class="card-text">${movieList[cardIndex].release_date.substring(0, 4)}</p>`)

        cardBody.append(cardTitle)
        $('#movieCards1').append(card)
        if (cardIndex === 3) {
            $('#card3').addClass('d-md-block')
        }
        $(`#card${cardIndex}`).append(cardTop, cardBody)
        $(`#card${cardIndex}`).click((event) => {
            $('.card-img-top').slideUp(300)
            $('#carouselContainer').show();
            carouselFiller(cardIndex, movieList);
        })
    }
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
            console.log(_.uniq(allApplicableMovies))
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
            if (!response) {
                console.log('error')
            }
            arrayOfMovieArrays.push(response.results)
            if (arrayOfMovieArrays.length === 40) {
                allMovies = _.flatten(arrayOfMovieArrays);
                allPlots = _.pluck(allMovies, 'overview');
                checkPlots(allMovies, allPlots, yourMood)
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
    console.log(yourMood)
    manyRandomMovies(yourMood);
    $('.cover-heading').hide()
    $('.mastheadAfterMood').show()
})

