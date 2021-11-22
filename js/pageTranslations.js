const webviews = require('webviews.js')
const statistics = require('js/statistics.js')
const settings = require('util/settings/settings.js')
const axios = require('./util/axios')

//处理nodeList至URL
function handleURL(qlist) {
  let str = ''
  for(let i = 0; i < qlist.length; i++) {
    qlist[i].replace("\n", "")
    if(i === 0 ) {
      str = str + qlist[i]
    } else{
      str = str + "\n" + qlist[i]
    }
  }
  return str
}

const pageTranslations = {
  apiURL: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
  translatePrivacyInfo: l('translateTip'),
  languages: [
    {
      name: '简体中文',
      code: 'zh'
    },
	  {
      name: '英文',
      code: 'en'
    },
    {
      name: 'Arabic',   //阿拉伯语
      code: 'ara'
    },
    {
      name: 'Dutch',    //荷兰语
      code: 'nl'
    },
    {
      name: 'French',
      code: 'fra'
    },
    {
      name: 'German',
      code: 'de'
    },
    {
      name: 'Italian',  //意大利
      code: 'it'
    },
    {
      name: 'Japanese',
      code: 'jp'
    },
    {
      name: 'Korean',
      code: 'kor'
    },
    {
      name: 'Polish',   //波兰
      code: 'pl'
    },
    {
      name: 'Portuguese',  //葡萄牙
      code: 'pt'
    },
    {
      name: 'Russian',
      code: 'ru'
    },
    {
      name: 'Spanish',   //西班牙
      code: 'spa'
    },
    {
      name: 'Vietnamese',   //越南语
      code: 'vie'
    }
  ],
  getLanguageList: function () {
    const userPrefs = navigator.languages.map(lang => lang.split('-')[0])
    const topLangs = pageTranslations.languages.filter(lang => userPrefs.includes(lang.code))

    // Translations to/from English are the highest quality in Libretranslate, so always show that near the top
    if (!topLangs.some(lang => lang.code === 'en')) {
      topLangs.push(pageTranslations.languages.find(lang => lang.code === 'en'))
    }
    const otherLangs = pageTranslations.languages.filter(lang => !userPrefs.includes(lang.code) && lang.code !== 'en')
    return [topLangs, otherLangs]
  },
  translateInto (tabId, language) {
    statistics.incrementValue('translatePage.' + language)

    if (!settings.get('translatePrivacyPrompt')) {
      const accepted = confirm(pageTranslations.translatePrivacyInfo)
      if (accepted) {
        settings.set('translatePrivacyPrompt', true)
      } else {
        return
      }
    }
    webviews.callAsync(tabId, 'send', ['translate-page', language])
  },
  //翻译请求接口
  makeTranslationRequest: async function (tab, data) {
    let result = {translatedText: []}
    const requestOptions = {
      toLang: data[0].lang,
      queryStr: handleURL(data[0].query)
    }
    axios.post('/app/translate', requestOptions).then(res => {
      for(let i = 0; i < res.data.trans_result.length; i++) {
        result.translatedText[i] = res.data.trans_result[i].dst
      }
      webviews.callAsync(tab, 'send', ['translation-response-' + data[0].requestId, {
        response: result
      }])
    }).catch(err => {
      console.warn('retrying translation request')
      setTimeout(()=> {
        axios.post('/app/translate', requestOptions).then(res => {
          for(let i = 0; i < res.data.trans_result.length; i++) {
            result.translatedText[i] = res.data.trans_result[i].dst
          }
          webviews.callAsync(tab, 'send', ['translation-response-' + data[0].requestId, {
            response: result
          }])
        }, 1000)
      })
    })
  },
  initialize: function () {
    webviews.bindIPC('translation-request', this.makeTranslationRequest)
  }
}

module.exports = pageTranslations
