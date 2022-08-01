const { SqlDb } = require('./sqldb.js')
const { nanoid } = require('nanoid')
let sqlDb = new SqlDb()

const logger = {
  output_level:'log',//log
  /**
   * 打印输出log，并添加到数据库中
   * @param type log,debug,warn,error,info
   * @param message 消息，可以是中文
   * @param data 附带的数据
   */
  print(type,message,data){
    console[type](message,data)
    var cache = [];
    let dataStr=JSON.stringify(data,(name,value)=>{
      if(['string','number','boolean','object'].indexOf(typeof value)>-1){
        if(typeof value==='object' && value!==null){
          if (cache.indexOf(value) !== -1) {
            // Circular reference found, discard key
            return;
          }
          // Store value in our collection
          cache.push(value)
        }
        return value
      }
    })
    cache = null;
    console.log(dataStr)
    data=JSON.parse(dataStr)
    logger.insertDb(type,message,data)
  },
  /**
   * 插入到数据库
   * @param type
   * @param message
   * @param data
   */
  insertDb(type,message,data){
    sqlDb.knex('log').insert({
      nanoid: nanoid(),
      type: type,
      data: data,
      message:message,
      create_time: Date.now()
    }).catch(e=>{
      console.error(e)
    })
  },
  debug:(message,data)=>{
    logger.print('debug',message,data)
  },
  info:(message,data)=>{
    logger.print('info',message,data)
  },
  log: (message,data) => {
    logger.print('log',message,data)
  },
  warn:(message,data)=>{
    logger.print('warn',message,data)
  },
  error:(message,data)=>{
    logger.print('error',message,data)
  }
}

module.exports=logger
