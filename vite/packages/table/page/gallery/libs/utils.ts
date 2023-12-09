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