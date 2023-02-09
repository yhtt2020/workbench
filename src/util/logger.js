const { SqlDb } = require('./sqldb.js')
const { nanoid } = require('nanoid')
let sqlDb = new SqlDb()

const logger = {
  output_level: 'log',//log
  /**
   * 打印输出log，并添加到数据库中
   * @param type log,debug,warn,error,info
   * @param message 消息，可以是中文
   * @param data 附带的数据
   */
  print (type, message, data) {
    var cache = []
    if (data) {
      let dataStr = JSON.stringify(data, (name, value) => {
        if (['string', 'number', 'boolean', 'object'].indexOf(typeof value) > -1) {
          if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
              // Circular reference found, discard key
              return
            }
            // Store value in our collection
            cache.push(value)
          }
          return value
        }
      })
      cache = null
      //console.log(dataStr)
      data = JSON.parse(dataStr)
    } else {
      data = {}
    }

    //console.log(type,message,data)
    logger.insertDb(type, message, data)
  },
  /**
   * 插入到数据库
   * @param type
   * @param message
   * @param data
   */
  async insertDb (type, message, data) {
    let logLimit = undefined
    let requestLog = false
    if (typeof window !== 'undefined') {
      //渲染进程中
      settings = require('../../js/util//settings/settings')
      logLimit = settings.get('logLimit')
      requestLog = settings.get('requestLog')
    } else {
      //主进程中
      if (global.settings) {
        logLimit = global.settings.get('logLimit')
        requestLog = global.settings.get('requestLog')
      }
    }
    if (requestLog===undefined) {
      requestLog=1000//默认为1000
      return
    }
    // 做限制操作
    if(logLimit){
      //如果设置了存储限制
      try{
        logger.getCount(async data => {
          if (data[0].count >= logLimit) {
            let needDeleteCount = data[0].count - logLimit
            let rows = await sqlDb.knex('log').where('create_time', '>', 0).orderBy('create_time').limit(needDeleteCount).select('create_time')
            if (rows[needDeleteCount-1]) {
              {
                await sqlDb.knex('log').where('create_time', '<', rows[needDeleteCount-1].create_time).delete()
                //由于存在并发，可能导致删除的时候超过了当时设置的数据的上线1-2条
              }
            }
          }
        })
      }catch (e) {
        console.warn(e)
        //防止爆炸
      }
    }

    sqlDb.knex('log').insert({
      nanoid: nanoid(),
      type: type,
      data: data,
      message: message,
      create_time: Date.now()
    }).catch(e => {
      console.error(e)
    })
  },
  debug: (message, data) => {
    logger.print('debug', message, data)
  },
  info: (message, data) => {
    logger.print('info', message, data)
  },
  log: (message, data) => {
    logger.print('log', message, data)
  },
  warn: (message, data) => {
    logger.print('warn', message, data)
  },
  error: (message, data) => {
    logger.print('error', message, data)
  },
  ts (ts) {
    if (ts) {
      return Math.round(performance.now() - ts) + 'ms'
    } else {
      return performance.now()
    }
  },
  getCount (cb) {
    sqlDb.knex('log').count({ count: '*' }).then((data) => {
      cb(data)
    })
  },
  clear (cb) {
    sqlDb.knex('log').truncate().then(data => {
      sqlDb.knex.raw('vacuum').then(()=>{
         cb(data)
      })
     
    })

  }
}

module.exports = logger
