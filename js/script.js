var app = new Vue({
    el: '#root',
    data: {
        searchedMovie:'',
        movies: [],
        infoVisibility: false,
        fullGenresList: undefined,
        selectedGenre: '',
        activeMovie: [],
    },
    mounted() {
        this.getFullGenresList()
    },
    beforeUpdate() {
        this.addVisibility()
        this.getCast()
        this.getGenres()
    },
    methods: {
        searchMovie() {
            axios.get(`https://api.themoviedb.org/3/search/multi?api_key=2d61f612414428cd866f192ad6c518ae&query=${this.searchedMovie}`).then(response => {
                this.movies = response.data.results;
                this.searchedMovie = '';
            })
        },
        getStars(movie) {
           return movie.vote_average * 10 + '%'
        },
        getCast(){
            this.movies.forEach(movie => {
                if (!movie.hasOwnProperty('cast')) {
                    movie.cast = []
                    axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=2d61f612414428cd866f192ad6c518ae&movie_id=${movie.id}`).then(response => {
                    for (let i = 0; i < 5; i++) {
                            obj = {actor: response.data.cast[i].original_name,character: response.data.cast[i].character}
                            movie.cast.push(obj)
                        }
                    })
                }
            })
        },
        getGenres() {
            this.movies.forEach(movie => {
                if (!movie.hasOwnProperty('genre')) {
                    movie.genres = []
                    movie.genre_ids.forEach(id =>{
                        this.fullGenresList.forEach(genre => {
                            if (id == genre.id) {
                                movie.genres.push(genre.name)
                            }
                        });
                    })
                }
            })
        },
        openInfo(movie) {
            this.infoVisibility = true
            this.activeMovie = movie
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
        getFullGenresList(){
            axios.get("https://api.themoviedb.org/3/genre/movie/list?api_key=2d61f612414428cd866f192ad6c518ae&language=en-US").then(response => {
                this.fullGenresList = response.data.genres
            })
        },
        selectGenre() {
            this.movies.forEach( movie => {
                movie.genres.forEach(genre => {
                    if (genre !== this.selectedGenre) {
                        movie.visible = false
                    }
                })
            })      
        },
        addVisibility() {
            this.movies.forEach( movie => {
                movie.visible = true;
            })
        }
    }
})