const routes = [
  { path: '/myapp', component: require('./pages/myapp-page.js') },
  { path: '/appstore', component: require('./pages/appstore-page.js') },
  { path: '/group', component: require('./pages/group-page.js') },
  { path: '/', redirect: { path: '/myapp' } }
]
module.exports = routes
