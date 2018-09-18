////////////////////// Movie API Scripts /////////////////////////

const tmdbAPIkey = 'c20ca68e2a577a2aebe1461e51d16a32';
let moodIndex = null;
let yourMood = null;
let movieList = [];
let movieTitles = [];




////////////// Used to get List of Genres IDs 
// let genreQueryUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${tmdbAPIkey}&language=en-US`

// $.get(genreQueryUrl).then((response) => {
//     const genreArray = response.genres;
//     console.log(genreArray)
// })
/////////////////////////////////

//////////////// Used to get KeyWord IDs 

// let keywordToSearch = ['tragic', 'dark', 'lonely', 'irreversible', 'sad']

// for (let i = 0; i < keywordToSearch.length; i++) {
//     let keywordTerm = keywordToSearch[i]
//     let keywordQueryUrl = `https://api.themoviedb.org/3/search/keyword?api_key=${tmdbAPIkey}&query=${keywordTerm}`

//     $.get(keywordQueryUrl).then((response) => {
//         const keywordArray = response;
//         console.log(keywordArray)
//     })
// }

///////////////////////////////////

// Genre CheatSheet 

// 0: {id: 28, name: "Action"}
// 1: {id: 12, name: "Adventure"}
// 2: {id: 16, name: "Animation"}
// 3: {id: 35, name: "Comedy"}
// 4: {id: 80, name: "Crime"}
// 5: {id: 99, name: "Documentary"}
// 6: {id: 18, name: "Drama"}
// 7: {id: 10751, name: "Family"}
// 8: {id: 14, name: "Fantasy"}
// 9: {id: 36, name: "History"}
// 10: {id: 27, name: "Horror"}
// 11: {id: 10402, name: "Music"}
// 12: {id: 9648, name: "Mystery"}
// 13: {id: 10749, name: "Romance"}
// 14: {id: 878, name: "Science Fiction"}
// 15: {id: 10770, name: "TV Movie"}
// 16: {id: 53, name: "Thriller"}
// 17: {id: 10752, name: "War"}
// 18: {id: 37, name: "Western"}

//////////////////////////////////////////////////////////////////


//////////// Keyword IDs

// friends = 9713
// happy = 231591
// happy ending = 9802
// exciting = 220996

// tragic = 10943
// tragic end = 33607
// dark = 244633
// lonely = 197823
// sad = 245371
// sad ending = 233003

/// work in progress ////////

const keywordObject = {
    happy: [9713, 231591, 9802, 220996],
    sad: [10943, 33607, 244633, 197823, 245371, 233003]
}
/////////////////////////

function MoodProfile(moodEnglish, moodIndex, genreIds, plotWords) {
    this.english = moodEnglish;
    this.index = moodIndex;
    this.genres = genreIds;
    this.plotWords = plotWords;
}



const happy = new MoodProfile('happy', 0, [16, 35, 10751], _.sample(keywordObject.happy, 3))
const sad = new MoodProfile('sad', 1, [18, 9648, 10749], _.sample(keywordObject.sad, 3))
const mad = new MoodProfile('mad', 1, [18, 9648, 10749], ['foo', 'foooo', 'bar'])
const silly = new MoodProfile('silly', 1, [18, 9648, 10749], ['foo', 'foooo', 'bar'])
const lonely = new MoodProfile('lonely', 1, [18, 9648, 10749], ['foo', 'foooo', 'bar'])
const shameful = new MoodProfile('shameful', 1, [18, 9648, 10749], ['foo', 'foooo', 'bar'])
const lost = new MoodProfile('lost', 1, [18, 9648, 10749], ['foo', 'foooo', 'bar'])
const peaceful = new MoodProfile('peaceful', 1, [18, 9648, 10749], ['foo', 'foooo', 'bar'])
/// etc.

const moodObjectArray = [happy, sad, mad, silly, lonely, shameful, lost, peaceful]
const moodStringArray = moodObjectArray.map(x => x.english)
let moodWord = '';

$('.moodButtons').click(function () {
    moodWord = $(this).attr('mood')
    moodIndex = moodStringArray.indexOf(moodWord);
    let yourMood = moodObjectArray[moodIndex]
    console.log(yourMood)
    let moodQueryUrl = `https://api.themoviedb.org/3/discover/movie?with_keywords=${yourMood.plotWords[0]}|${yourMood.plotWords[1]}|${yourMood.plotWords[2]}&with_genres=${yourMood.genres[0]}|${yourMood.genres[1]}|${yourMood.genres[2]}&page=1&include_adult=false&language=en-US&api_key=${tmdbAPIkey}`;
    // let moodQueryUrl = `https://api.themoviedb.org/3/discover/movie?with_original_language=en&with_genres=${yourMood.genres[0]}|${yourMood.genres[1]}|${yourMood.genres[2]}&vote_count.gte=100&page=1&include_video=false&include_adult=false&sort_by=vote_average.desc&language=en-US&api_key=${tmdbAPIkey}`;
    console.log(moodQueryUrl);
    $.get(moodQueryUrl).then((response) => {
        console.log(response);
        movieList = _.sample(response.results, 5);
        movieTitles = movieList.map(x => x.title);
        console.log(movieList);
        console.log(movieTitles);
        player0.cuePlaylist({
            listType: 'search',
            list: movieTitles[0] + ' trailer'
        })
        player1.cuePlaylist({
            listType: 'search',
            list: movieTitles[1] + ' trailer'
        })
        player2.cuePlaylist({
            listType: 'search',
            list: movieTitles[2] + ' trailer'
        })
        player3.cuePlaylist({
            listType: 'search',
            list: movieTitles[3] + ' trailer'
        })
        player4.cuePlaylist({
            listType: 'search',
            list: movieTitles[4] + ' trailer'
        })
    })
    
})




///////////////// Youtube API


let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
$(tag).insertBefore($('script:first'))

let player;
let player1;
let player2;
let player3;
let player4;

function onYouTubeIframeAPIReady() {
    player0 = new YT.Player('moodMovie1', {
        height: '480',
        width: '640',
        videoId: '',
        playerVars: {listType: 'search',
        list: ''}

    })
    player1 = new YT.Player('moodMovie2', {
        height: '480',
        width: '640',
        videoId: '',
        playerVars: {listType: 'search',
        list: ''}

    })
    player2 = new YT.Player('moodMovie3', {
        height: '480',
        width: '640',
        videoId: '',
        playerVars: {listType: 'search',
        list: ''}

    })
    player3 = new YT.Player('moodMovie4', {
        height: '480',
        width: '640',
        videoId: '',
        playerVars: {listType: 'search',
        list: ''}

    })
    player4 = new YT.Player('moodMovie5', {
        height: '480',
        width: '640',
        videoId: '',
        playerVars: {listType: 'search',
        list: ''}

    }) 
}