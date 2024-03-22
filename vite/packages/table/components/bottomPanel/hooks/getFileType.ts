// import { apps, doc } from "../../desk/addIcon/hook/defaultData";
const apps = [
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
// 获取文件分类类型
export const fileTypeClass = {
  // 文件类型
  fileType(data: any) {
    if(data.type === 'tableApp'){
      // 匹配data.value是否字符串,并且是否为C:/开头
      if (typeof data.value === "string" && data.value.startsWith("C:\\")){
        // 拆分获取文件扩展名
        const fileName = data.value.split("\\").pop().split(".");
        if(fileName.length > 1){
          // 获取文件扩展名
          const softFileName = `.${data.value.split("\\").pop().split(".").pop()}`;
          // 查找文件扩展名称是否匹配
          const isSoft = apps.some((item)=>{
            return item === softFileName
          });
          if(isSoft)  return "软件";
          return "文件";
        }
      }
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
