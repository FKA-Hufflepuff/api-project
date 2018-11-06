const mainModule = (() => {
    const _tmdbAPIkey = 'c20ca68e2a577a2aebe1461e51d16a32'
    const _omdbAPIkey = '8a053050'
    const _allGenres = [28, 12, 16, 35, 80, 99, 18, 10751, 14, 36, 27, 10402, 9648, 10749, 878, 10770, 53, 10752, 37]
    const _moods = {
        _happy: {
            genres: [16, 35, 10751],
            terms: ['friend', 'friends', 'family', 'celebration', 'comedy', 'funny'],
            movieList: []
        },
        _sad: {
            genres: [18, 9648, 10749],
            terms: ['dark', 'tragic', 'lonely', 'loss', 'death', 'dying', 'dead', 'cry', 'lose', 'sad', 'alone'],
            movieList: []
        },
        _mad: {
            genres: [28, 53, 10752],
            terms: ['cruel', 'angry', 'ruin', 'anger', 'mad', 'madness', 'violence', 'fight', 'kill', 'destroy', 'destruction', 'revenge'],
            movieList: []
        },
        _lonely: {
            genres: [99, 878, 10749],
            terms: ['dystopian', 'heartbroken', 'personal', 'lonely', 'loss', 'heartbreak', 'seperation', 'break-up', 'abandon', 'alone', 'love'],
            movieList: []
        },
        _inLove: {
            genres: [12, 35, 10749],
            terms: ['magical', 'charming', 'love', 'romance', 'romantic', 'wedding', 'marriage', 'boyfriend', 'girlfriend'],
            movieList: []
        },
        _silly: {
            genres: [35, 14, 10402],
            terms: ['exciting', 'outrageous', 'laughter', 'satire', 'comedy', 'wild', 'high jinks', 'mockumentary', 'funny', 'laughter', 'party', 'scheme'],
            movieList: []
        },
        _random: {
            genres: _.sample(_allGenres, 3),
            terms: null,
            movieList: []
        }
    }
    let _moodSelected = {}
    let _carouselLoaded = false
    let _rateLimit = 40
    let _queryUrl = ''
    let _page = 1
    let _plotMap = new Map();


    const resetPage = () => {
        _moodSelected = {}
        _page = 1
        _queryUrl = ''
        _plotMap = new Map();
        $('#carouselContainer').hide()
        $('.cover-heading').hide()
        $('.mastheadAfterMood').show()
    }

    const _setMood = input => {
        _moodSelected = _moods[input]
        _plotMap.clear();
        if (_moodSelected.terms) _moodSelected.terms.map(x => _plotMap.set(x, []))
    }
    const setMood = input => _setMood(input)

    const getMood = () => _moodSelected;

    const _plotFilter = movies => movies.filter((x, i, a) => (x.overview.toLowerCase().split(/[^a-z]/g).filter(word => _plotMap.has(word))).length)

    const _ajaxCall = queryUrl => {
        $.ajax({
                type: 'GET',
                url: queryUrl
            })
            .done((data, textStatus, jqXHR) => {
                _moodSelected.movieList = (!_moodSelected.terms) ? _moodSelected.movieList.concat(data.results) : _moodSelected.movieList.concat(_plotFilter(data.results));
                _page++;
                _rateLimit = jqXHR.getResponseHeader('X-RateLimit-Remaining')
                grabMovies()
            })
    }

    const _carouselFiller = (index, movieList) => {
        let players = []
        movieTitles = movieList.map(x => x.title);
        $(`#slide${index}, #carouselIndicator${index}`).addClass('active');
        $(`#slide${index}, #carouselIndicator${index}`).siblings().removeClass('active');
        if (!_carouselLoaded) {
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
            _carouselLoaded = true;
        } else {
            for (let i = 0; i < 6; i++) {
                players[i].cuePlaylist({
                    listType: 'search',
                    list: movieTitles[i] + ' trailer'
                })
            }
        }
    }

    const _cardGenerator = (movieList) => {
        $('#cardsGoHere').hide();
        movieList.map((movie, i, a) => {
            $(`#card${i} .moviePoster`).attr('src', `https://image.tmdb.org/t/p/w185/${movie.poster_path}`)
            $(`#card${i} .movieTitle`).text(`${movie.title}`)
            let imdbUrl = `https://omdbapi.com/?apikey=${_omdbAPIkey}&t=${movie.title}`;
            $.get(imdbUrl).then((response) => {
                (response.Response === 'True') ?
                $(`#card${i} .imdbBtn`).attr('href', `https://www.imdb.com/title/${response.imdbID}`).show():
                    $(`#card${i} .imdbBtn`).hide()
            })
            $(`#btnGroup${i}`).click(() => {
                $('.moviePoster').hide()
                $('#carouselContainer').show();
                _carouselFiller(i, movieList);
            })
        })
        $('#cardsGoHere').show();
    }

    const _processMovies = () => {
        return new Promise((resolve, reject) => {
            console.log(_moodSelected.movieList);
            resolve(_.sample((_moodSelected.movieList), 6))
        })
    }

    const processMovies = () => _processMovies().then(res => _cardGenerator(res))

    const grabMovies = () => {
        _queryUrl = `https://api.themoviedb.org/3/discover/movie?with_original_language=en&with_genres=${_moodSelected.genres[0]}|${_moodSelected.genres[1]}|${_moodSelected.genres[2]}&page=${_page}&include_adult=false&language=en-US&api_key=${_tmdbAPIkey}`;
        (_page >= 40 || _rateLimit < 1) ? _processMovies().then(res => _cardGenerator(res)): _ajaxCall(_queryUrl)

    }

    return {
        resetPage,
        setMood,
        getMood,
        processMovies,
        grabMovies
    }
})()

const {
    resetPage,
    setMood,
    getMood,
    grabMovies,
    processMovies
} = mainModule;

///////////// Load iFrame API Asynchronously 
let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
$(tag).insertBefore($('script:first'))
/////////////////////////////////////////////////

/////////////////////// Mood selection
$('.moodButtons').click(function () {
    resetPage();
    setMood($(this).attr('mood'))
    let chosenMood = getMood();
    console.log(chosenMood)
    chosenMood.movieList.length ? processMovies() : grabMovies()
})


