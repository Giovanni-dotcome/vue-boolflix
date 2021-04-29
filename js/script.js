var app = new Vue({
    el: '#root',
    data: {
        searched:'',
        movies: []
    },
    methods: {
        searchMovie() {
            axios.get(`https://api.themoviedb.org/3/search/movie/?api_key=2d61f612414428cd866f192ad6c518ae&query=${this.searched}`).then(response => {
                this.movies = response.data.results;
                console.log(this.movies);
            })
            this.searched = '';
        }
    }
})