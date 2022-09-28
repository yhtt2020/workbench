let app={
  "name": "应用市场",
  "version": "1.0.0",
  "theme_color": "#3c78d8",
  "author": "想天软件",
  "site": "https://apps.vip",
  "logo": "https://up.apps.vip/logo/favicon.svg",
  "type": "web",
  "url": "https://a.apps.vip/appStore/index.html",
  "preload": '/pages/guide/preload.js',
  "package": "com.thisky.appStore",
  "summary": "应用市场，助您发现更大的世界。",
  "attribute": {
    isOffical: 1,
    integration: 2
  },
  "settings": {
    bounds: {
      width: 1180,
      height: 864,
    },
    showInSideBar: true
  }
}

module.exports=app
