Vue.component('sidenav', {
	data() {
		return {
			current: ['mail'],
			openKeys: ['sub1'],
		};
	},
	template: '#sidenavTpl',
	watch: {
		openKeys(val) {
			console.log('openKeys', val);
		},
	},
	methods: {
		handleClick(e) {
			console.log('click', e);
		},
		titleClick(e) {
			console.log('titleClick', e);
		},
	}
})
