export const clockSelectList = [
 {
  name:'优设标题黑',
  value:"font-family: '优设标题黑' !important;"
 },
 {
  name:'Typefesse-Pleine',
  value:"font-family: 'Typefesse-Pleine' !important;",
 },
 {
  name:'LLPixelFun-Regular',
  value:"font-family: 'LLPixelFun-Regular' !important;"
 },
 {
  name:'Ouroboros-Regular',
  value:"font-family: 'Ouroboros-Regular' !important;"
 },
 {
  name:'Pilowlava-Regular',
  value:"font-family: 'Pilowlava-Regular' !important;"
 }
]

export const clockTabList = [
 { name:"自定义字体",value:"font" },
 { name:"其他样式",value:"style" }
]





// import { defineStore } from 'pinia';
// import dbStorage from '../../../../store/dbStorage';

// // @ts-ignore
// export const clockStore = defineStore('clock',{
//  state:()=>({
//   clockSetting:{
//    enableSecond:false,
//    backgroundFrame:false,
//    font: {
//     name:'优设标题黑',
//     value:"font-family: '优设标题黑' !important;"
//    },
//    currentStatus:"font",
//   }
//  }),
//  actions:{},
//  persist: {
//   enabled:true,
//   strategies: [{
//    // 自定义存储的 key，默认是 store.$id
//    // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
//    path:['clockSetting'],
//    storage: dbStorage,
//    // state 中的字段名，按组打包储存
//   }]
//  }
// })