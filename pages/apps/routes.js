const routes = [
  {name:'myapp', path: '/myapp', component: require('./pages/myapp-page.js') },
  {name:'cloud', path: '/cloud', component: require('./pages/cloud-page.js') },
  {name:'cloudNavs', path:'/cloudNavs', component: require('./pages/cloudNavsPage.js')},
  {name:'appstore', path: '/appstore', component: require('./pages/appstore-page.js') },
  {name:'groupList', path: '/groupList', component: require('./pages/groupListPage.js') },
  {name:'home', path: '/', redirect: { path: '/myapp' } }
]
module.exports = routes
