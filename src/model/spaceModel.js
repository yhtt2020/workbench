if (typeof window !== 'undefined') {
  ldb = window.ldb
}
const localSpaceModel = require('./localSpaceModel')
const backupSpaceModel = require('./backupSpaceModel')
const userModel = require('./userModel')
const { nanoid } = require('nanoid')
const { SqlDb }=require('../util/sqldb')
const sqlDb=new SqlDb()
const CURRENT_SPACE_KEY='system.space.currentSpace'
const spaceModel = {
  type: 'local',
  user: {
    uid: 0
  },
  adapterModel: require('./localSpaceModel'),
  /**
   * 使用最新的登录用户的凭证去刷新每个空间和当前空间的用户凭证
   */
  async updateSpaceInfo () {
    //仅对登录成功做更新操作
    ldb.reload()
    let db = ldb.db
    try {
      //将全部的空间的用户凭证修改为最新登录的凭证
      let currentSpace = db.get('currentSpace').value()
      let userInfo = await userModel.get({ uid: currentSpace.userInfo.uid })
      userInfo.clientId=userModel.getClientId()
      db.get('spaces').filter({ 'type': 'cloud', uid: userInfo.uid }).each((sp) => {
        sp.userInfo = userInfo
      }).write()

      if (currentSpace.spaceType === 'cloud' && currentSpace.userInfo.uid === userInfo.uid) {
        //当前空间为云空间，且登录用户为当前登录的用户，则去刷新这个空间
        let backupSpace = db.get('spaces').find({ id: currentSpace.spaceId })
        if (!!!backupSpace) {
          //如果没找到备份空间，就只更新一下用户信息
          db.get('currentSpace').assign({ userInfo: userInfo }).write()
        } else {
          //更新一下用户信息和当前的空间信息
          db.get('currentSpace').assign({ userInfo: userInfo, space: backupSpace }).write()
        }
      }
    } catch (e) {
      console.error(e)
    }
  },
  setUser (user) {
    spaceModel.user = user
    if (user.uid === 0) {
      spaceModel.setAdapter('local')
    } else {
      spaceModel.setAdapter('cloud')
      spaceModel.adapterModel.user=user
    }
    return spaceModel
  },
  setAdapter (type = 'local') {
    if (type !== 'local') {
      spaceModel.type = 'cloud'
      spaceModel.adapterModel = require('./cloudSpaceModel')
    } else {
      spaceModel.type = 'local'
      spaceModel.adapterModel = require('./localSpaceModel')
    }
    return spaceModel
  },

  async getUserSpaces (option) {
    let result = await spaceModel.adapterModel.getUserSpaces(spaceModel.user, option)

    async function getSpaceState (space) {
      if (spaceModel.user.uid) { //云端判断逻辑
        if (space.client_id && space.client_id !== spaceModel.user.clientId) {
          space.isOtherUsing = true
          space.isUsing = true
        } else if ((space.client_id === spaceModel.user.clientId)) {
          space.isSelfUsing = true
          space.isUsing = true
        } else {
          space.isUsing = false
        }
        if (Date.now() - space.sync_time > 30000) {
          space.disconnect = true
        } else {
          space.disconnect = false
        }
      } else {
        await spaceModel.setAdapter('local').getCurrent().then(sp => {
          if (space.nanoid === sp.spaceId) {
            space.isSelfUsing = true
            space.isUsing = true
          }
        })
      }
    }

    if (result.status === 1) {
      let spaces = result.data
      spaces.forEach((space) => {
        getSpaceState(space)
      })
    }
    return result
  },

  insertFirstSpace (data = {
    'version': 2,
    'state': {
      'tasks': [],
      'selectedTask': ''
    },
    'saveTime': Date.now(),
  }) {
    ldb.reload()
    let spaceAdd = {
      name: '默认空间',
      data: data,
      count_task: 1,
      count_tab: 1,
      create_time: Date.now(),
      update_time: Date.now(),
      sync_time: Date.now(),
      uid: 0,
      type: 'local',
      id: nanoid()
    }
    ldb.db.get('spaces').push(spaceAdd).write()
    console.warn('插入了默认空间', spaceAdd)
    let currentSpace = {
      spaceId: spaceAdd.id,
      spaceType: 'local',
      name: spaceAdd.name,
      userInfo: {
        uid: 0
      },
      space: spaceAdd
    }
    ldb.db.set('currentSpace', currentSpace).write()
    return currentSpace
  },
  /**
   * 获取当前空间，
   */
  async getCurrent (needDetail = false) {

    let currentSpace = await sqlDb.getConfig(CURRENT_SPACE_KEY,undefined)
    if(currentSpace===undefined){
      //初始化
      console.warn('需要初始化')
      await sqlDb.setConfig(CURRENT_SPACE_KEY,null,'当前空间，默认为null')
    }
    if (!!!currentSpace) { //如果是首次读入，不存在currentSpace就插入一个默认的值
      console.warn('空间损坏，基本不会走这条路线')
      return false
    }
    if (currentSpace.spaceId === -1) {
      throw '空间id无效'
    }
    let space = {}
    if (currentSpace.spaceType === 'cloud') {
      //如果是云端，则从云端取
      try {
        let result = await spaceModel.setUser(currentSpace.userInfo).getSpace(currentSpace.spaceId)
        if (result.status === 1) {
          if (result.data.id === '-1') {
            space = backupSpaceModel.getSpace(currentSpace.spaceId)
            console.error('云端空间已被删除，读入备份空间')
            //throw '云端空间已被删除'
          } else {
            space = result.data
            space.id = space.nanoid
          }
        } else {
          console.error('请求服务器空间失败，读入备份空间')
          space = backupSpaceModel.getSpace(currentSpace.spaceId)
        }
        // else{
        //   throw '云端获取空间失败，网络错误'
        // }
      } catch (e) {
        //如果没取成，则取备份空间
        space = backupSpaceModel.getSpace(currentSpace.spaceId)
        if (!!!space) {
          console.error('致命错误，本地空间备份丢失')
          throw '本地备份空间丢失或不存在'
        }
      }
    } else {
      space = await require('./localSpaceModel').getSpace(currentSpace.spaceId)
      if (!!!space) {
        space = {
          name: '本机空间',
          nanoid: nanoid()
        }
        console.error('意外未能获得当前空间')
      }
      currentSpace.space = space
      currentSpace.spaceId = space.nanoid
      currentSpace.name = space.name
    }
    return currentSpace
  },
  async getSpace (id) {
    return spaceModel.adapterModel.getSpace(id, spaceModel.user)
  },
  async copy (space) {
    return spaceModel.adapterModel.copy(space, spaceModel.user)
  },
  async addSpace (space) {
    return spaceModel.adapterModel.addSpace(space, spaceModel.user)
  },

  getCloudSpace (nanoid) {
    return {}
  },

  async changeCurrent (space) {
    //关闭mainWindow（自动会保存）
    let result = await spaceModel.adapterModel.changeCurrent(space, spaceModel.user)
    if (result.status) {
      ipc.send('closeUserWindow')
      return result.data
    }
    //设置数据库中的当前空间
  },
  async getLocalSpaces () {
    return localSpaceModel.getAll()
  },
  async deleteSpace (space) {
    return await spaceModel.adapterModel.deleteSpace(space, spaceModel.user)
  },
  async importFromLocal (spaces) {
    return await spaceModel.adapterModel.importFromLocal(spaces, spaceModel.user)
  },
  async renameSpace (newName, space) {
    return await spaceModel.adapterModel.renameSpace(newName, space, spaceModel.user)
  },
  async getLastSyncSpace () {
    return await spaceModel.adapterModel.getLastSyncSpace()
  },
  async clientOffline () {
    return await spaceModel.adapterModel.clientOffline(spaceModel.user)
  },
  async clientOnline (nanoid, force = false) {
    return await spaceModel.adapterModel.clientOnline(nanoid, force, spaceModel.user)
  },

  async setCurrentSpace (space) {
    await sqlDb.setConfig(CURRENT_SPACE_KEY,{
      space:space,
      name:space.name,
      spaceId:space.nanoid,
      spaceType:space.type
    })
  }

}

module.exports = spaceModel
