const logger = require('../../util/logger')

class StorageFile {
  constructor () {
    this.logger=require('../../util/logger')
  }
  load(path,opts,callback){
    this.logger.debug('Load', path);
    const ts = this.logger.ts();

    const onError = (e) => {
      logger.error('Error reading local file', path, e);
      if (callback) {
        callback(e, null);
      }
    };
    fs.readFile(path,undefined,(data,err)=>{
      if (err) {
        return onError(err);
      }
      fs.stat(path,(stat,err)=>{
        if (err) {
          return onError(err);
        }
        const rev=stat.mtime.getTime().toString()
        this.logger.debug('Loaded', path, rev, this.logger.ts(ts));
        if(callback){
          callback(null,data.buffer,{rev})
        }
      })
    })
  }
  async saveToFile (path,buffer,callback) {
    console.log(buffer)
    const dataAsArrayBuffer = buffer
    require('fs').writeFile(path, Buffer.from(dataAsArrayBuffer),callback);
  }
}

module.exports=StorageFile
