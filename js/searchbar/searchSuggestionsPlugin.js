var searchbarPlugins = require('searchbar/searchbarPlugins.js')

var urlParser = require('util/urlParser.js')
var searchEngine = require('util/searchEngine.js')
const axios = require('axios')

function showSearchSuggestions (text, input, event) {
  const suggestionsURL = searchEngine.getCurrent().suggestionsURL

  if (!suggestionsURL) {
    searchbarPlugins.reset('searchSuggestions')
    return
  }

  if ((searchbarPlugins.getResultCount() - searchbarPlugins.getResultCount('searchSuggestions')) > 3) {
    searchbarPlugins.reset('searchSuggestions')
    return
  }

  const axios = require('axios')
  const iconv = require('iconv-lite')
  if (searchEngine.getCurrent().name === 'Baidu') {
    axios({
      method: 'get',
      url: suggestionsURL.replace('%s', encodeURIComponent(text)),
      responseType: 'stream'
    }).then(res => {
      // 此时的res.data 则为stream
      const chunks = []
      res.data.on('data', chunk => {
        chunks.push(chunk)
      })
      res.data.on('end', () => {
        const buffer = Buffer.concat(chunks)
        // 通过iconv来进行转化。
        const str = iconv.decode(buffer, 'gbk')
        // https://chrunlee.cn/article/axios-gbk-utf8.html
        let results = JSON.parse(str)
        searchbarPlugins.reset('searchSuggestions')
        if (searchbarPlugins.getResultCount() > 3) {
          return
        }
        if (results) {
          results = results[1].slice(0, 3)
          results.forEach(function (result) {
            var data = {
              title: result,
              url: result
            }

            if (urlParser.isPossibleURL(result)) { // website suggestions
              data.icon = 'carbon:earth-filled'
            } else { // regular search results
              data.icon = 'carbon:search'
            }

            searchbarPlugins.addResult('searchSuggestions', data)
          })
        }
      })
    })
  } else if (suggestionsURL) {
    fetch(suggestionsURL.replace('%s', encodeURIComponent(text)), {
      cache: 'force-cache'
    })
      .then(function (response) {
        return response.json()
      })
      .then(function (results) {
        searchbarPlugins.reset('searchSuggestions')

        if (searchbarPlugins.getResultCount() > 3) {
          return
        }

        // console.log(results)
        if (results) {
          results = results[1].slice(0, 3)
          results.forEach(function (result) {
            var data = {
              title: result,
              url: result
            }

            if (urlParser.isPossibleURL(result)) { // website suggestions
              data.icon = 'carbon:earth-filled'
            } else { // regular search results
              data.icon = 'carbon:search'
            }

            searchbarPlugins.addResult('searchSuggestions', data)
          })
        }
      })
  }
}

function initialize () {
  searchbarPlugins.register('searchSuggestions', {
    index: 4,
    alias: '搜索建议',
    trigger: function (text) {
      return !!text && text.indexOf('!') !== 0 && !tabs.get(tabs.getSelected()).private
    },
    showResults: debounce(showSearchSuggestions, 50)
  })
}

module.exports = { initialize }
