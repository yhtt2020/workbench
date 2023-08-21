<template>
  <div class="CardItem">
    <div class="left">
      <div class="title">
        <span>{{ title }}</span>
      </div>
      <div class="bottom">
        <div class="date">
          <span>{{ time }}  {{ date }}</span>
        </div>
        <div class="name">
          <span>{{ author }}</span>
        </div>
      </div>
  
    </div>
    <div class="right" >
      
    </div>
  
  </div>
  </template>
  
  <script setup lang='ts'>
  import {ref,reactive} from 'vue'
  const title=ref('大运会那些精彩的瞬间')
  const time=ref('03-04')
  const date=ref('11:00')
  const author=ref('北京日报')
  defineProps<{
    title:string,
    time:number|string,
    date:string|number,
    author:string
  }>()
  </script>
  <style lang='less' scoped>
  .CardItem{
    width: 266px;
    height: 93px;
    // background: rgba(0,0,0,0.30);
    // margin-right: 1%;
    margin-bottom: 1.7%;
    // opacity: 0;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    .left{
      width: 152px;
      margin-left: 0.5%;
      .title{
        width: 100%;
        height: 40px;
        // padding-top: 12px;
        span{
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: rgba(255,255,255,0.85);
          font-weight: 400;
        }
        
      }
      .bottom{
        width: 100%;
        height: 17px;
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
        margin-bottom: 10px;
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