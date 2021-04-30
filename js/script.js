var app = new Vue({
    el: '#root',
    data: {
        searched:'',
        movies: [],
        infoVisibility: false,
        cast: [],
        fullGenresList: undefined,
        genresList: [],
        genres: [],
    },
    mounted() {
        this.getGenres()
    },
    methods: {
        searchMovie() {
            axios.get(`https://api.themoviedb.org/3/search/multi?api_key=2d61f612414428cd866f192ad6c518ae&query=${this.searched}`).then(response => {
                this.movies = response.data.results;
                this.searched = '';
            })
        },
        getStars(movie) {
           return movie.vote_average * 10 + '%'
        },
        seeCast(movie){
            this.cast = [];
            axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=2d61f612414428cd866f192ad6c518ae&movie_id=${movie.id}`).then(response => {
                for (let i = 0; i < 5; i++) {
                    this.cast.push(`${response.data.cast[i].original_name} as: ${response.data.cast[i].character}`)
                }
            })
        },
        seeGenres(movie) {
            this.fullGenresList.forEach(genre => {
                movie.genre_ids.forEach(id => {
                    if (id == genre.id) {
                        this.genres.push(genre.name);
                    }
                });
            });
        },
        openInfo() {
            this.infoVisibility = true
        },
        closeInfo(){
            this.infoVisibility = false
        },
        renderOverview(movie) {
            if (typeof movie.overview === 'string') {
                if (movie.overview.length > 300) {
                    movie.overview = movie.overview.substring(0, 300) + "..."
                }
                return movie.overview
            } else {
                return 'overview unavailable'
            }
        },
        getGenres(){
            axios.get("https://api.themoviedb.org/3/genre/movie/list?api_key=2d61f612414428cd866f192ad6c518ae&language=en-US").then(response => {
                this.fullGenresList = response.data.genres
            })
        }
    }
})
// https://api.themoviedb.org/3/search/movie?api_key=2d61f612414428cd866f192ad6c518ae&query=rambo

// https://api.themoviedb.org/3/genre/movie/list?api_key=2d61f612414428cd866f192ad6c518ae&language=en-US