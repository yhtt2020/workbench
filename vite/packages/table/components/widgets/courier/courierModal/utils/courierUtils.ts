import { expressList } from '../modalMock'
// 匹配快递公司名称
export function getCourierName(data:any){
 // console.log('查看有没有传值进来',data);
 // 匹配纯数字
 // console.log('查看结果1',isNumeric(data));
 // console.log('查看结果2',hasUppercasePrefix(data));
 


 // 前缀编码
 if(hasUppercasePrefix(data)){
  const match = /^[A-Z]{2}/.exec(data);
  if(match !== null){
   return findData(match[0])
  }

 }
 

 // 纯数字,并且长度为14 返回是中通快递
 if(isNumeric(data) && data.length === 14){
  let existsWord = 'ZTO'
  return findData(existsWord)
 }

 // 纯数字,并且长度为15 返回是申通快递
 if(isNumeric(data) && data.length === 15){
  let existsWord = 'STO'
  return findData(existsWord)
 }

 // 纯数字,并且长度为13 返回是邮政快递包裹
 if(isNumeric(data) && data.length === 13){
  let existsWord = 'YZPY'
  return findData(existsWord)
 }


 

 

}

// 通过参数进行查找
function findData(params:any){
 // console.log('查找条件参数',params);
 const isRegex = new RegExp(params)
 const find = expressList.find((item)=>{
  return isRegex.test(item.code)
 })
 return find
}

function isNumeric(string:any){
 return /^-?\d+(\.\d+)?$/.test(string) && !isNaN(Number(string));
}

function hasUppercasePrefix(string:any) {
 return /^[A-Z]/.test(string);
}