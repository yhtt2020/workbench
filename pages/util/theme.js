db = require('../../js/util/database').db
const wallUrl='http://d.xiangtian.ren/api/wall/' //壁纸存储的cdn地址
const wallPaper = {
  get: async () => {
    return db.system.get({ name: 'newtabBg' })
  },
  set: async (image) => {
      let newtabBg = await db.system.get({ name: 'newtabBg' })
      const imageUrl=wallUrl+image
      if (!!!newtabBg) {
        db.system.put({ name: 'newtabBg', value: imageUrl })
      } else {
        return db.system.update(newtabBg.id, { name: 'newtabBg', value: imageUrl })
      }
  },
  setElementBg: (element, bg) => {
    if (!!!bg) {
      //背景不存在
      return false
    }
    element.style = `
                background: url("${bg}") no-repeat;
                background-size:cover;
                background-attachment:fixed;
                `
  },
  getWallPaperUrl:(name)=>{
    return wallUrl+name
  }
}

const themeSetting = {
  getNewtabCardOpacity: () => {
    return db.system.get({ name: 'newtabCardOpacity' })
  },
  set: async () => {

  }
}

module.exports = { wallPaper, themeSetting }
