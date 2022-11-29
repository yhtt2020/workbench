const path=require('path')
export function getLogo(logo,local_dir,fileProtocol=true){
  console.log(logo,local_dir)
  if(logo.startsWith('local|')){
    return  (fileProtocol?'file://':'')+ logo.replace('local|','')
  }else{
    return logo
  }
}
