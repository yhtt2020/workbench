import {runExec} from "./exec";

export function getCover(appid){
  return 'https://cdn.cloudflare.steamstatic.com/steam/apps/'+appid+'/header.jpg'
}
export function getClientIcon(appid,icon){
  return `https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/${appid}/${icon}.ico`
}
export function getIcon(appid,icon){
  return `https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/${appid}/${icon}.jpg`

}
export const steamProtocol={
  _run(cmd){
    runExec('start steam://'+cmd)
  },
  run(appid,args=''){
    steamProtocol._run('run/'+appid+'/'+args)
  },
  uninstall(appid){
    steamProtocol._run('run/'+appid)
  },
}
