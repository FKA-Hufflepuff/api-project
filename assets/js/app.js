const mainModule = (() => {
    const _tmdbAPIkey = 'c20ca68e2a577a2aebe1461e51d16a32'
    const _omdbAPIkey = '8a053050'
    const _allGenres = [28, 12, 16, 35, 80, 99, 18, 10751, 14, 36, 27, 10402, 9648, 10749, 878, 10770, 53, 10752, 37]
    const _moods = {
        _happy: {
            genres: [16, 35, 10751],
            terms: ['friends', 'family', 'celebration', 'comedy', 'funny']
        },
        _sad: {
            genres: [18, 9648, 10749],
            terms: ['dark', 'tragic', 'lonely', 'loss', 'death', 'dying', 'dead', 'cry']
        },
        _mad: {
            genres: [28, 53, 10752],
            terms: ['cruel', 'angry', 'ruin', 'anger', 'mad', 'madness', 'violence', 'fight']
        },
        _lonely: {
            genres: [99, 878, 10749],
            terms: ['dystopian', 'heartbroken', 'personal', 'lonely', 'loss', 'heartbreak', 'seperation', 'break-up', 'abandon', 'alone', 'love']
        },
        _inLove: {
            genres: [12, 35, 10749],
            terms: ['magical', 'charming', 'love', 'romance', 'romantic', 'wedding', 'marriage', 'boyfriend', 'girlfriend']
        },
        _silly: {
            genres: [35, 14, 10402],
            terms: ['exciting', 'outrageous', 'laughter', 'satire', 'comedy', 'wild', 'high jinks', 'mockumentary', 'funny', 'laughter', 'party', 'scheme']
        },
        _random: {
            genres: _.sample(_allGenres, 3),
            terms: null
        }
    }
    let _moodSelected = {}
    let _carouselLoaded = false
    let _movieList = []
    let _applicableMovies = []
    let _rateLimit = 40
    let _queryUrl = ''
    let _page = 1


    const resetPage = () => {}

    const _setMood = input => {
        _moodSelected = _moods[input]
        return _moodSelected
    }
    const setMood = input => _setMood(input)

    const ajaxCall = queryUrl => {
        $.ajax({
                type: 'GET',
                url: queryUrl
            })
            .done((data, textStatus, jqXHR) => {
                _movieList = [..._movieList, ...data.results]
                _page++;
                _rateLimit = jqXHR.getResponseHeader('X-RateLimit-Remaining')
                grabMovies()
            })
    }

    const _processMovies = () => {
        if (!_moodSelected.terms) {
            console.time('Sample Test')
            _movieList = _.sample(_.uniq(_movieList), 6)
            console.timeEnd('Sample Test')
        }else {
            console.log(_movieList)
            console.log(_moodSelected.terms)
            console.time('Map test')
            console.log(_movieList.map(x => x.overview.split(' ')).map(x => x.filter((e, i, a) => _moodSelected.terms.indexOf(e) != -1)).filter((x, i, a) => {if (a[i].length) {_applicableMovies.push(_movieList[i]); return _applicableMovies}}))
            console.timeEnd('Map test')
            console.log(_applicableMovies)
            // .map((x, i, a) => (x.length) ? _movieList[i] : ))
            // .map(x => [].filter((a, b) => {})))
        }
    }


    // if (!yourMood.plotWords) {
    //     movieList = _.sample(_.uniq(allMovies), 6);
    //     cardGenerator(movieList);
    // } else {
    //     let allPlots = _.pluck(allMovies, 'overview');
    //     checkPlots(allMovies, allPlots, yourMood);
    // }

    const grabMovies = () => {
        _queryUrl = `https://api.themoviedb.org/3/discover/movie?with_original_language=en&with_genres=${_moodSelected.genres[0]}|${_moodSelected.genres[1]}|${_moodSelected.genres[2]}&page=${_page}&include_adult=false&language=en-US&api_key=${_tmdbAPIkey}`;
        (_page >= 40 || _rateLimit < 1) ? _processMovies () : ajaxCall(_queryUrl)
    }


    return {
        resetPage,
        setMood,
        grabMovies
    }
})()

const {
    resetPage,
    setMood,
    grabMovies
} = mainModule;



// const tmdbAPIkey = 'c20ca68e2a577a2aebe1461e51d16a32';
// const omdbAPIkey = '8a053050'
// let moodIndex = 0;
// let yourMood = {};
// let movieList = [];
// let movieTitles = [];
// let carouselLoaded = false;
// let players = [{}, {}, {}, {}, {}, {}]
// let allGenres = [28, 12, 16, 35, 80, 99, 18, 10751, 14, 36, 27, 10402, 9648, 10749, 878, 10770, 53, 10752, 37]
// let moodWord = '';




// const moodObjectArray = [happy, sad, mad, lonely, inLove, silly, random]
// const moodStringArray = moodObjectArray.map(x => x.english)
///////////////////////////////////////

///////////// Load iFrame API Asynchronously 
let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
$(tag).insertBefore($('script:first'))
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
                $('.moodButtons').click(() => {
                    event.target.pauseVideo()
                })
                event.target.cuePlaylist({
                    listType: 'search',
                    list: movieTitles[i] + 'movie trailer'
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
        imdbUrl = `https://omdbapi.com/?apikey=${omdbAPIkey}&t=${movieList[i].title}`
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
        let movieObject = $(`<div class="col-lg-2 col-md-4 col-sm-6 col-xs-12 mx-auto my-2" id="card${cardIndex}">`)
        let poster = $(`<div id="moodMovie${cardIndex}">` + `<img class="moviePoster img-thumbnail img-fluid" src="https://image.tmdb.org/t/p/w185/${movieList[cardIndex].poster_path}">`)
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
    for (let page = 1; page <= 40; page++) {
        let moodQueryUrl = `https://api.themoviedb.org/3/discover/movie?with_original_language=en&with_genres=${yourMood.genres[0]}|${yourMood.genres[1]}|${yourMood.genres[2]}&page=${page}&include_adult=false&language=en-US&api_key=${tmdbAPIkey}`;
        $.get(moodQueryUrl).then((response) => {
            arrayOfMovieArrays.push(response.results)
            if (arrayOfMovieArrays.length === 40) {
                let allMovies = _.flatten(arrayOfMovieArrays);
                ////// Skips plots for random button ////////
                if (!yourMood.plotWords) {
                    movieList = _.sample(_.uniq(allMovies), 6);
                    cardGenerator(movieList);
                } else {
                    let allPlots = _.pluck(allMovies, 'overview');
                    checkPlots(allMovies, allPlots, yourMood);
                }
            }
        })
    }
}
////////////////////



/////////////////////// Mood selection
$('.moodButtons').click(function () {

    // reset stuff
    // $('#carouselContainer').hide()
    // movieList = [];
    // $('.cover-heading').hide()
    // $('.mastheadAfterMood').show()
    //
    setMood($(this).attr('mood'))
    grabMovies()
    // manyRandomMovies(yourMood);
})