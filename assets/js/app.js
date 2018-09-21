const tmdbAPIkey = 'c20ca68e2a577a2aebe1461e51d16a32';
let moodIndex = 0;
let yourMood = {};
let movieList = [];
let movieTitles = [];

let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
$(tag).insertBefore($('script:first'))

let player0 = {};
let youtubeAPIReady = false;

function onYouTubeIframeAPIReady() {
    youtubeAPIReady = true;
}


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
let moodWord = '';

const playerGenerator = (index, movieList) => {
    movieTitles = movieList.map(x => x.title);

    const onPlayerReady = (event) => {
        event.target.cuePlaylist({
            listType: 'search',
            list: movieTitles[index] + ' trailer'
        })
    }

    if (!_.isEmpty(player0)) {
        console.log(player0);
        player0.destroy();
    }

    player0 = new YT.Player('trailerSpace', {
        height: '480',
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

    $('#soloMovie').show()
    let currentMovie = movieList[index];

    let movieInfo = {
        title: `<h1>${currentMovie.original_title}</h1>`
    }
    $('#movieInfoSpace').empty().append(movieInfo.title)
}

const cardGenerator = (movieList) => {
    $('#cardsGoHere').empty();
    $('#cardsGoHere').append('<div class="container" id="cardContainer">')
    $('#cardContainer').append('<div class="card-deck" id="movieCards1">')
    for (let cardIndex = 0; cardIndex < movieList.length; cardIndex++) {
        let card = $(`<div class="card" id="card${cardIndex}">`)
        let cardTop = $(`<div id="moodMovie${cardIndex}">` + `<img class="card-img-top" src="http://image.tmdb.org/t/p/w185/${movieList[cardIndex].poster_path}">`)
        let cardBody = $(`<div class="card-body">`)
        let cardTitle = $(`<h2 class="card-title text">${movieList[cardIndex].title}</h2>`)
        cardBody.append(cardTitle)
        $('#movieCards1').append(card)
        $(`#card${cardIndex}`).append(cardTop, cardBody)
        $(`#card${cardIndex}`).click((event) => {
            $('.card-img-top').slideUp(300)
            playerGenerator(cardIndex, movieList)
        })
    }

}

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

const manyRandomMovies = (yourMood) => {
    let arrayOfMovieArrays = [];
    let allMovies = [];
    let allPlots = [];
    for (let page = 1; page <= 25; page++) {
        let moodQueryUrl = `https://api.themoviedb.org/3/discover/movie?with_original_language=en&with_genres=${yourMood.genres[0]}|${yourMood.genres[1]}|${yourMood.genres[2]}&page=${page}&include_adult=false&language=en-US&api_key=${tmdbAPIkey}`;
        $.get(moodQueryUrl).then((response) => {
            if (!response) {
                console.log('error')
            }
             arrayOfMovieArrays.push(response.results)
            if (arrayOfMovieArrays.length === 25) {
                allMovies = _.flatten(arrayOfMovieArrays);
                allPlots = _.pluck(allMovies, 'overview');
                checkPlots(allMovies, allPlots, yourMood)
            }
        })
    }
}

$('.moodButtons').click(function () {
    $('#soloMovie').hide()
    movieList = [];
    moodWord = $(this).attr('mood')
    moodIndex = moodStringArray.indexOf(moodWord);
    let yourMood = moodObjectArray[moodIndex]
    console.log(yourMood)
    manyRandomMovies(yourMood);
})