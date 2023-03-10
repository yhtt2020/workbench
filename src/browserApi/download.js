const ipcHelper = require('./ipcHelper')
let downloadItems=[]
function send(channel,args={}){
  ipcHelper.send('download',channel,args)
}
async function start(channel,args={}){
  return await ipcHelper.sendSync('download',channel,args)
}

const download={
  start (options){
    options.id=Date.now()
    downloadItems.push(options)
    send('start',JSON.parse(JSON.stringify(options)))
  },
}

ipc.on('download.onUpdated',(e,a)=>{
  let found=downloadItems.find(di=>{
   return di.id===a.item.id
  })
  if(found.updated){
    found.updated(a)
  }
})
ipc.on('download.onDone',(e,a)=>{
  let index=-1
  let found=downloadItems.find((di,index)=>{
    return di.id===a.item.id
  })
  downloadItems.splice(index,1)
  if(found.done){
    found.done(a)
  }
})

ipc.on('download.onWillDownload',(e,a)=>{
  let found=downloadItems.find(di=>{
    return di.id===a.item.id
  })
  if(found && found.willDownload){
    found.willDownload(a)
  }
})
module.exports=download
