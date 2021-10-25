
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
			window.tab=e.key
			this.$emit('gettab',e.key)
		},
		titleClick(e) {
			console.log('titleClick', e);
		},
	}
})
