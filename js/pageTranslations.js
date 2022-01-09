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
  baiduError: [
    '52001',   //百度侧请求超时
    '54005',   //长query请求频繁
    '54003',   //访问频率受限
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
    //1000毫秒发起一次请求
    setTimeout(()=> {
      axios.post('/app/translate', requestOptions).then(res => {
        if(res.code === 1000) {
          for(let i = 0; i < res.data.trans_result.length; i++) {
            result.translatedText[i] = res.data.trans_result[i].dst
          }
          webviews.callAsync(tab, 'send', ['translation-response-' + data[0].requestId, {
            response: result
          }])
        }
      }).catch(err => {
        //只有错误码列表中的错误，才会进行重新翻译请求
        if(pageTranslations.baiduError.indexOf(err.message.slice(8)) !== -1) {
          console.warn('retrying translation request')
          setTimeout(()=> {
            axios.post('/app/translate', requestOptions).then(res => {
              for(let i = 0; i < res.data.trans_result.length; i++) {
                result.translatedText[i] = res.data.trans_result[i].dst
              }
              webviews.callAsync(tab, 'send', ['translation-response-' + data[0].requestId, {
                response: result
              }])
            }, 3000)
          })
        }
      })
    }, 200)
  },
  initialize: function () {
    webviews.bindIPC('translation-request', this.makeTranslationRequest)
  }
}

module.exports = pageTranslations
