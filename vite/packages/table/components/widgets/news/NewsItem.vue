<template>
  <div class="CardItem">
    <div class="left">
      <div class="title">
        <span>{{ NewsMsgList.title }}</span>
      </div>
      <div class="bottom">
        <div class="date">
          <span>{{NewsMsgList.date }}</span>
        </div>
        <div class="name">
          <span>{{ NewsMsgList.author_name }}</span>
        </div>
      </div>
  
    </div>
    <div class="right" >
      
    </div>
  
  </div>
  </template>
  
  <script setup lang='ts'>
  import {ref,reactive} from 'vue'
  // const title=ref('大运会那些精彩的瞬间')
  // const time=ref('03-04')
  // const date=ref('11:00')
  // const author=ref('北京日报')
  defineProps({
    NewsMsgList:{
      type:Array,
    }
    
  })
  </script>
  <style lang='scss' scoped>
  .CardItem{
    width: 266px;
    height: 93px;
    margin-bottom: 1.9%;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    
    .left{
      width: 152px;
      margin-left: 0.5%;
      .title{
        width: 100%;
        height: auto;
        // padding-top: 12px;
        margin-top: 1.4%;
        // white-space: normal;
        // overflow-wrap: break-word;
        span{
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: rgba(255,255,255,0.85);
          font-weight: 400;
          white-space: normal;
        }
        
      }
      .bottom{
        width: 100%;
        height: 17px;
        display: flex;
        justify-content: space-between;
        // margin-top: 20px;
        // margin-bottom: 10px;
        margin-top: 9.2%;
        margin-bottom: 1.4%;
        .date{
          span{
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: rgba(255,255,255,0.40);
            font-weight: 400;
          }
        }
        .name{
          span{
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: rgba(255,255,255,0.40);
            font-weight: 400;
          }
        }
        
      }
    }
    .right{
      background: rgba(0,0,0,0.30);
      border-radius: 10px;
      width: 100px;
      height: 77px;
      margin: 8px 0px;
      margin-right:0.8% ;
    }
  }
  </style>