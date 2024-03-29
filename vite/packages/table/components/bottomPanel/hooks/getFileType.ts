// import { apps, doc } from "../../desk/addIcon/hook/defaultData";
export  const apps = [
  '.exe',
  '.msi',
  '.apk',
  '.app',
  '.url',
  '.bat',
  '.cmd',
  '.com',
  '.gadget',
  '.jar',
  '.wsf',
  '.msc',
  '.scr',
  '.cpl',
  '.appx',
  '.appxbundle',
  '.msix',
  '.msixbundle',
  '.xap',
  '.xpi',
  '.crx',
  '.link',
  '.desktop',
  '.sh',
  '.run',
  '.bin',
  '.appimage',
  '.deb',
  '.lnk',
];

export  const doc=[
  ".docx",
  ".pptx",
  '.txt',
  '.pdf',
  '.xlsx',
  '.doc',
  '.ppt',
  '.xls',
  '.md',
  '.xml',
  '.docm',
  '.odt',
  '.csv',
  '.pptm',
  '.ppsm',
  '.zip',
]
// 获取文件分类类型
export const fileTypeClass = {
  // 文件类型
  fileType(data: any) {
    if(data.type === 'tableApp'){
      if(data.ext){
        const isSoft = apps.some((item)=>{  return item === data.ext });
        if(isSoft)  return "软件";
      }
      return "文件";
    }
    else if (data.type === 'default'){
      return '网页';
    }
    else if (data.type === 'systemApp'){
      return '系统应用';
    }
    else if (data.type === 'lightApp'){
      return '轻应用';
    }
    else if (data.type === 'coolApp'){
      return '酷应用';
    }
  },
};

// 获取软件类的数据
export const getSoftData = (list:any) =>{
  const softList:any = [];
  for(const item of list){
    // 判断item.ext不是空的
    if(item.ext && item.type === 'tableApp'){
      const isSoft = apps.some((app)=>{ return app === item.ext });
      if(isSoft)  softList.push(item);
    }
  }
  return softList;  
}

