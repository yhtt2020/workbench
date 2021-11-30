const routes = [
  {name:'myapp', path: '/myapp', component: require('./pages/myapp-page.js') },
  {name:'cloud', path: '/cloud', component: require('./pages/cloud-page.js') },
  {name:'appstore', path: '/appstore', component: require('./pages/appstore-page.js') },
  {name:'group', path: '/group', component: require('./pages/group-page.js') },
  {name:'home', path: '/', redirect: { path: '/myapp' } }
]
module.exports = routes
