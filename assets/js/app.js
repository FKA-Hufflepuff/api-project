////////////////////// Movie API Scripts /////////////////////////

const tmdbAPIkey = 'c20ca68e2a577a2aebe1461e51d16a32';
let mood = '';
$('.moodButtons').click(function () {
    mood = $(this).attr('mood')
})

let genresForMood = [];
const moodArray = ['happy', 'sad', 'mad', 'silly', 'lonely']
let moodIndex = moodArray.indexOf(mood);

switch (moodIndex) {
    case 0:
        genresForMood.push('romantic comedy', 'childrens')
        break;
    case 1:
        genresForMood.push('drama')
        break;
    case 2:
        genresForMood.push('action', 'horror')
        break;
    case 3:
        genresForMood.push('comedy')
        break;
    case 4:
        genresForMood.push('independent')
        break;
    default:
        break;
}

let genreQueryUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${tmdbAPIkey}&language=en-US`

$.get(genreQueryUrl).then((response) => {
    console.log(response);
})
// Happy rom com or childrens 
// Sad drama
// Mad action, horror
// Silly comedies
// Lonely independent


//////////////////////////////////////////////////////////////////