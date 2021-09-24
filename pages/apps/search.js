Vue.component('search', {
	data() {
		return {
			dataSource: [],
		};
	},
	template:'#searchTpl',
	methods: {
		onSelect(value) {
			console.log('onSelect', value);
		},

		handleSearch(value) {
			this.dataSource = value ? this.searchResult(value) : [];
		},

		getRandomInt(max, min = 0) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		},

		searchResult(query) {
			return new Array(this.getRandomInt(5))
				.join('.')
				.split('.')
				.map((item, idx) => ({
					query,
					category: `${query}${idx}`,
					count: this.getRandomInt(200, 100),
				}));
		},
	}
})
