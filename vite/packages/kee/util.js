const path=require('path')
export function getLogo(logo,local_dir,fileProtocol=true){
  if(logo==='local'){
    return  (fileProtocol?'file://':'')+ path.join(local_dir,'logo.png')
  }else{
    return logo
  }
}
