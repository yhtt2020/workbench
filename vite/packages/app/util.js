const path=require('path')
export function getLogo(logo,fileProtocol=true){
  if(logo.startsWith('local|')){
    return  (fileProtocol?'file://':'')+ logo.replace('local|','')
  }else{
    return logo
  }
}
