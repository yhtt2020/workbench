import content from './modules/content'
import subFolder from './modules/subFolder'
import config from './modules/config'
import ui from './modules/ui'
import user from './modules/user'
import group from './modules/group'
import { createStore } from 'vuex'

const store = createStore({
  modules: {
    content,//内容模块,
    subFolder,//子文件夹
    config,//配置
    ui,//界面
    user,//用户
    group//团队
  }
})

export default store
