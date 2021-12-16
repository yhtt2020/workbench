const path = require('path')
const fs = require('fs')
let scripts = [];
const userScriptModel={
  init(userDataPath){
    const pathName=userDataPath+'/userscripts/'
    fs.readdir(pathName, function(err, files){
      console.log(files);
      for (var i=0; i<files.length; i++)
      {
        let filename=files[i]
        if(filename.endsWith('.js')){
          fs.stat(path.join(pathName, files[i]), function(err, data){
            if(data.isFile())
            {

              let script={}
              script.filename=filename
              script.size=data.size
              script.createTime=data.ctime
              scripts.push(script)
            }
          })
        }
      }
      console.log(scripts);

    })
    return scripts
  }
}
module.exports=userScriptModel
