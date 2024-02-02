import { storeToRefs } from 'pinia';
import {taskStore} from './store';

// 根据当前任务章节遍历获取全部奖励
export const getCurrentTaskReward = (id:any)=>{
 const task = taskStore();
 const { currentTaskList } = storeToRefs(task);
 const result:any = currentTaskList.value.find((item:any) => item.name == id);
 if (result) {
  let { awardList } = result;
  let arr:any = [];
  for(const arrItem of awardList){
   if (arrItem.label == "道具"){
    arr.push({name: "头像", type: "avatarFrame",icon: arrItem.data.icon,})
   }
   else if (arrItem.label == "勋章"){
    arr.push({type: "medal",icon: arrItem.data.icon_lg,});
   }
   else if (arrItem.label == "积分"){
    if(arrItem.data.name == "社区积分"){
     arr.push({  type: "communityPoints", value: arrItem.origin.value,});
    }
    else{
     arr.push({ type: "experience",value: arrItem.origin.value, });
    }
   }
  }
  return arr;
 } 
 else {
  return null;
 }
}

// 判断是否完成主线任务
export const getUnFinishTaskStatus = () =>{
 const task = taskStore();
 const { currentTaskList } = storeToRefs(task);
 const result:any = currentTaskList.value.find((item:any) => item.name == "M0302");
 // console.log("result",result);
 return result;
}

