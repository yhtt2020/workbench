const settings = require('../../util/settings/settings.js')

const oneTab = {
  newtabList: [
    'ts://newtab',
    'https://limestart.cn/',
    'https://inftab.com/',
    'https://go.itab.link/'
  ],

  selectOnetab() {
    let selected = ''
    const browserTab = settings.get('browserTab')

    if(browserTab && browserTab.tabIdx < this.newtabList.length) {
      selected = this.newtabList.find((v, index) => index === browserTab.tabIdx)
    } else {
      if(browserTab.custom) {
        selected = browserTab.custom
      }
    }

    selected = selected.length > 0 ? selected : 'ts://newtab'
    return selected
  }
}


module.exports = oneTab
