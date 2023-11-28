/**
 * 获取此项之前的第一个group的颜色
 * @param array
 * @param index
 * @param field
 */
export function getColor(array,index,field='groupName'){
  for(let i=index;i>=0;i--){
    if(array[i]){
      if(array[i][field]){
        //是组
        return array[i].color
      }
    }
  }
  return index
}
export function isGroupFirst(array,index,field='groupName'){
  if(array[index-1]){
    if(array[index-1][field]){
      //是组
      return true
    }else{
      return false
    }
  }
  return index
}
export function isGroupLast(array,index,field='groupName'){
  if(array[index+1]){
    if(array[index+1][field] ){
      //是组
      return true
    }else{
      return false
    }
  }else{
    return true
  }
}
