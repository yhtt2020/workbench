
Vue.component('sidenav', {
	name:'sidenav',
	data() {
		return {
			current: ['myapp']
		}
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
