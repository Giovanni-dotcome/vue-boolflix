var app = new Vue({
    el: '#root',
    data: {
        url: `https://api.themoviedb.org/3`,
        api_key: '2d61f612414428cd866f192ad6c518ae',
        searchedMovie:'',
        movies: [],
        moviesFiltered: [],
        infoVisibility: false,
        fullGenresList: [],
        selectedGenre: '',
        selectedShowType: '',
        activeMovie: [],
    },
    mounted() {
        this.getFullGenresList()
    },
    beforeUpdate() {
        this.getCast()
        this.getGenres()
    },
    methods: {
        searchMovie() {
            axios.get(`${this.url}/search/multi?`, {
                params: {
                    api_key: this.api_key,
                    query: this.searchedMovie
                }
            }).then(response => {
                this.movies = response.data.results;
                this.moviesFiltered = this.movies
                this.searchedMovie = '';
            });
        },
        getStars(movie) {
           return movie.vote_average * 10 + '%'
        },
        getCast(){
            this.movies.forEach(movie => {
                if (!movie.hasOwnProperty('cast')) {
                    movie.cast = []
                    if (movie.media_type === 'movie') {
                        axios.get(`${this.url}/movie/${movie.id}/credits?`, {
                            params: {
                                api_key: this.api_key,
                                movie_id: movie.id
                            }
                        }).then(response => {
                        for (let i = 0; i < 5; i++) {
                                if (response.data.cast[i] != undefined) {
                                    obj = {actor: response.data.cast[i].original_name, character: response.data.cast[i].character}
                                    movie.cast.push(obj)
                                }
                            }
                        })
                    } else {
                        axios.get(`${this.url}/tv/${movie.id}/credits?`, {
                            params: {
                                api_key: this.api_key,
                                movie_id: movie.id
                            }
                        }).then(response => {
                        for (let i = 0; i < 5; i++) {
                                if (response.data.cast[i] != undefined) {
                                    obj = {actor: response.data.cast[i].original_name, character: response.data.cast[i].character}
                                    movie.cast.push(obj)
                                }
                            }
                        })
                    } 
                }
            })
        },
        getGenres() {
            this.movies.forEach(movie => {
                if (!movie.hasOwnProperty('genres')) {
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
            if (this.selectedGenre !== "all") {
                this.moviesFiltered = this.movies.filter(movie => {
                    if (movie.genre_ids != undefined) {
                        let flag = false;
                        for (let i = 0; i < movie.genre_ids.length -1; i++) {
                            if (movie.genre_ids[i] == this.selectedGenre) {
                                flag = true;
                            }
                        }
                        return flag         
                    }
                })
            } else {
                this.moviesFiltered = this.movies
            }            
        }
    }
})