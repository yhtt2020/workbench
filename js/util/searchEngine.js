if (typeof require !== 'undefined') {
  var settings = require('util/settings/settings.js')
}
// otherwise, assume window.settings exists already

var currentSearchEngine = {
  name: '',
  searchURL: '%s'
}

var defaultSearchEngine = 'Baidu'

var searchEngines = {
  Baidu: {
    name: 'Baidu',
    alias: '百度',
    searchURL: 'https://www.baidu.com/s?wd=%s',
    suggestionsURL: 'https://www.baidu.com/su?wd=%s&action=opensearch',
    queryParam: 'wd'
  },
  yuan: {
    name: 'yuan',
    alias: '元社区',
    searchURL: 'https://s.apps.vip/search-result?keyword=%s',
    // suggestionsURL: 'https://www.baidu.com/su?wd=%s&action=opensearch',
    queryParam: 'keyword'
  },
  bilibili: {
    name: 'bilibili',
    alias: '哔哩哔哩',
    searchURL: 'https://search.bilibili.com/all?keyword=%s',
    // suggestionsURL:'https://s.search.bilibili.com/main/suggest?term=%s',
    queryParam: 'keyword'
  },
  zhihu: {
    name: 'zhihu',
    alias: '知乎',
    searchURL: 'https://www.zhihu.com/search?type=content&q=%s',
    // suggestionsURL:'https://s.search.bilibili.com/main/suggest?term=%s',
    queryParam: 'q'
  },
  Bing: {
    name: 'Bing',
    alias: '必应',
    searchURL: 'https://www.bing.com/search?q=%s',
    suggestionsURL: 'https://www.bing.com/osjson.aspx?query=%s',
    queryParam: 'q'
  },
  DuckDuckGo: {
    name: 'DuckDuckGo',
    alias: 'DuckDuckGo',
    searchURL: 'https://duckduckgo.com/?q=%s&t=min',
    suggestionsURL: 'https://ac.duckduckgo.com/ac/?q=%s&type=list&t=min',
    queryParam: 'q'
  },
  Google: {
    name: 'Google',
    alias: '谷歌',
    searchURL: 'https://www.google.com/search?q=%s',
    queryParam: 'q'
  },

  Yahoo: {
    name: 'Yahoo',
    alias: '雅虎',
    searchURL: 'https://search.yahoo.com/yhs/search?p=%s',
    suggestionsURL: 'https://search.yahoo.com/sugg/os?command=%s&output=fxjson',
    queryParam: 'p'
  },

  StartPage: {
    name: 'StartPage',
    alias: 'StartPage',
    searchURL: 'https://www.startpage.com/do/search?q=%s',
    suggestionsURL: 'https://www.startpage.com/cgi-bin/csuggest?query=%s&format=json',
    queryParam: 'q'
  },
  Ecosia: {
    name: 'Ecosia',
    alias: 'Ecosia',
    searchURL: 'https://www.ecosia.org/search?q=%s',
    suggestionsURL: 'https://ac.ecosia.org/autocomplete?q=%s&type=list',
    queryParam: 'q'
  },
  Qwant: {
    name: 'Qwant',
    alias: 'Qwant',
    searchURL: 'https://www.qwant.com/?q=%s',
    suggestionsURL: 'https://api.qwant.com/api/suggest/?q=%s&client=opensearch',
    queryParam: 'q'
  },
  Wikipedia: {
    name: 'Wikipedia',
    alias: '维基百科',
    searchURL: 'https://wikipedia.org/w/index.php?search=%s',
    suggestionsURL: 'https://wikipedia.org/w/api.php?action=opensearch&search=%s',
    queryParam: 'search'
  },
  Yandex: {
    name: 'Yandex',
    alias: 'Yandex',
    searchURL: 'https://yandex.com/search/?text=%s',
    suggestionsURL: 'https://suggest.yandex.com/suggest-ff.cgi?part=%s',
    queryParam: 'text'
  },

  none: {
    name: 'none',
    alias: '无',
    searchURL: 'http://%s'
  }
}

for (const e in searchEngines) {
  try {
    searchEngines[e].urlObj = new URL(searchEngines[e].searchURL)
  } catch (e) {}
}

settings.listen('searchEngine', function (value) {
  if (value && value.name) {
    currentSearchEngine = searchEngines[value.name]
  } else if (value && value.url) {
    var searchDomain
    try {
      searchDomain = new URL(value.url).hostname.replace('www.', '')
    } catch (e) {}
    currentSearchEngine = {
      name: searchDomain || 'custom',
      alias: '自定义',
      searchURL: value.url,
      custom: true
    }
  } else {
    currentSearchEngine = searchEngines[defaultSearchEngine]
  }
})

var searchEngine = {
  getCurrent: function () {
    return currentSearchEngine
  },
  getSearch: function (url) {
    var urlObj
    try {
      urlObj = new URL(url)
    } catch (e) {
      return null
    }
    for (var e in searchEngines) {
      if (!searchEngines[e].urlObj) {
        continue
      }
      if (searchEngines[e].urlObj.hostname === urlObj.hostname && searchEngines[e].urlObj.pathname === urlObj.pathname) {
        if (urlObj.searchParams.get(searchEngines[e].queryParam)) {
          return {
            engine: searchEngines[e].name,
            search: urlObj.searchParams.get(searchEngines[e].queryParam)
          }
        }
      }
    }
    return null
  }
}

if (typeof module === 'undefined') {
  window.currentSearchEngine = currentSearchEngine
} else {
  module.exports = searchEngine
}
