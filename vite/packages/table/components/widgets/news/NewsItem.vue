<template>
  <!-- {{ NewsMsgList.NewsMsgList.title }} -->
  <!-- {{ timer[1] }} -->
  <!-- {{ [hour,min] }} -->
  <div class="CardItem" >
    
    <div class="left">
      <div class="title" @click="goNews" :style="{width:showImg==false?'260px':''}">
        {{ NewsMsgList.NewsMsgList.title }}
      </div>
      <div class="bottom">
        <div class="date">
          <span>{{timer[0]}} {{ timer[1] }}</span>
        </div>
        <div class="name">
          <span>{{ NewsMsgList.NewsMsgList.author_name }}</span>
        </div>
      </div>
  
    </div>
    <div class="right" :style="{backgroundImage:img?`url(${img})`:''}" v-if="showImg">
      <!-- <img :src="img" alt="" class="image"> -->
    </div>
  
  </div>
  </template>
  
  <script setup lang='ts'>
  import {ref,reactive,computed} from 'vue'
  import {useRouter} from 'vue-router'
  const router=useRouter()
  let showImg=ref(true)
  const NewsMsgList = defineProps({
    NewsMsgList:{
      type:Array,
    }
    
  })
  const goNews=()=>{
    router.push(NewsMsgList.NewsMsgList.url)
  }
  const timer=computed(()=>{
    let [updateDate,updateTime]=NewsMsgList.NewsMsgList.date.split(' ')
    let [item,...arr]=updateDate.split('-')
    let [hour,min,_]=updateTime.split(':')
    const Utime=[hour,min].join(':')
    const uDate=arr.join("-")
    return [uDate,Utime]
  })

  const img=computed(()=>{
    if(NewsMsgList.NewsMsgList.thumbnail_pic_s){
      return NewsMsgList.NewsMsgList.thumbnail_pic_s
    }else{
      return showImg.value=false
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
      // margin-left: 0.5%;
      .title{
        width: 100%;
        height: auto;
        // padding-top: 12px;
        margin-top: 2.4%;
        white-space: pre-wrap;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        overflow: hidden;
        // overflow-wrap: break-word;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba(255,255,255,0.85);
        font-weight: 400;
        text-align: left;
        
        
      }
      
      .bottom{
        width: 100%;
        height: 17px;
        display: flex;
        justify-content: space-between;
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
      background-size: cover;
    }
  }
  </style>