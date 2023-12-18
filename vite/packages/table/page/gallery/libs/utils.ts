import { storeToRefs  } from 'pinia';
import { paperStore } from '../../../store/paper';
import _ from 'lodash-es';

// 判断文件是否为图片
export function fileImageExtension(filePath:any){
 const fileExtensions = filePath.src.split('.').pop()
 const extensions = ['mp4', 'mpeg', 'avi', 'rmvb']
 return extensions.indexOf(fileExtensions) !== -1;
}

// 判断是否激活
export function isInActive(image:any){
 const paper:any = paperStore();
 const { activePapers } = storeToRefs(paper);
 const index = _.findIndex(activePapers.value,function(img:any){  return image.src === img.src });
 return index > -1;
}

// 时间转换
export function changeTime(msec:any){
 let datetime = new Date(msec);
 let year = datetime.getFullYear();
 let month = datetime.getMonth();
 let date = datetime.getDate();
 let hour = datetime.getHours();
 let minute = datetime.getMinutes();
 let second = datetime.getSeconds();
 let monthTime:any;
 let dayTime:any;
 let hourTime:any;
 let minuteTime:any;
 let secondTime:any;
 // 月
 if((month + 1) >= 10){ monthTime =  (month + 1) ; } 
 else { monthTime = '0' + (month + 1)  }
 // 天
 if((date + 1) < 10){ dayTime = '0' + date; }
 else { dayTime = date }
 // 小时
 if((hour + 1) < 10){ hourTime = '0' + hour  }
 else { hourTime = hour }
 // 分钟
 if((minute + 1) < 10 ){ minuteTime = '0' + minute }
 else { minuteTime = minute }
 // 秒钟
 if((second + 1) < 10){ secondTime = '0' + second  }
 else { secondTime = second }

 const lastTime = year + '/' + monthTime + '/' + dayTime + ' ' + hourTime + ':' + minuteTime + ':' + secondTime;

 return lastTime;
}

// 匹配路径是否存在&进行文件名称获取
export function getFileName(path:any){
 // 匹配表达式
 const regex = /&/;
 const fileRegex = /^file:/;
 const selectRegex = /^https:\/\/a\.apps\.vip\/papers\/origin\//;
 // 匹配返回值
 const exist = regex.test(path);
 const existFile = fileRegex.test(path);
 const selectFile = selectRegex.test(path);
 // 判断匹配成功就返回文件名称
 if(selectFile) { return path.split('/')[path.split('/').length - 1]; }
 else if(exist){ return path.split('&')[1].split('=')[1]; }
 else if(existFile){ return path.split('file://')[1].split('/')[2] }
 else { return path.split('https://')[1].split('/')[2]; }
}

// 判断是否收藏壁纸
export function isInMyPapers(image:any){
 const paper = paperStore();
 const { myPapers } = storeToRefs(paper);
 const index  = _.findIndex(myPapers.value,function(img:any){ return String(image.src) === String(img.src) });
 return index > -1;
}

// 判断是否为本地下载
export function isLocalDownload(image:any){
 const fileRegex = /^[A-Z]:\\|file:\/\//;
 const isLocalFile = fileRegex.test(image.src);
 if(!isLocalFile){ return true; }
 else { return false; }
}