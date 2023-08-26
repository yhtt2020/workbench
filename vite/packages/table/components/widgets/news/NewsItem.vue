<template>
  <div class="card-item">

    <div class="left" :style="{ width: showImg == false ? '260px' : '' }" >
      <div class="title" @click="goNews" style="background: var(--mask-bg);color: var(--primary-text);" >
        {{ newsMsgList.newsMsgList.title }}
      </div>
      <div class="bottom" >
        <div class="date"  >
          <span style="background: var(--mask-bg);color: var(--primary-text);">{{ timer[0] }} {{ timer[1] }}</span>
        </div>
        <div class="name">
          <span style="background: var(--mask-bg);color: var(--primary-text);" >{{ newsMsgList.newsMsgList.author_name }}</span>
        </div>
      </div>

    </div>
    <div class="right" :style="{ backgroundImage: img ? `url(${img})` : '' }" v-if="showImg">
      <!-- <img :src="img" alt="" class="image"> -->
    </div>

  </div>
</template>
  
<script setup lang='ts'>
import { ref, reactive, computed } from 'vue'
// vite\packages\table\js\common\browser.ts
import browser from '../../../js/common/browser'
let showImg = ref(true)
const newsMsgList = defineProps({
  newsMsgList: {
    type: Array,
  }

})
const goNews = () => {
  
  browser.openInUserSelect(newsMsgList.newsMsgList.url)
}
const timer = computed(() => {
  let [updateDate, updateTime] = newsMsgList.newsMsgList.date.split(' ')
  let [item, ...arr] = updateDate.split('-')
  let [hour, min, _] = updateTime.split(':')
  const Utime = [hour, min].join(':')
  const uDate = arr.join("-")
  return [uDate, Utime]
})

const img = computed(() => {
  if (newsMsgList.newsMsgList.thumbnail_pic_s) {
    return newsMsgList.newsMsgList.thumbnail_pic_s
  } else {
    return showImg.value = false
  }
})

</script>
<style lang='scss' scoped>
.card-item {
  width: 266px;
  height: 93px;
  margin-bottom: 1.9%;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;

  .left {
    width: 152px;
    // margin-left: 0.5%;
    position: relative;

    .title {
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
      color: rgba(255, 255, 255, 0.85);
      font-weight: 400;
      text-align: left;
      cursor: pointer;

    }

    .bottom {
      width: 100%;
      height: 17px;
      display: flex;
      // justify-content: space-between;
      position: absolute;
      // margin-top: 9.2%;
      bottom: 10px;

      .date {
        span {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.40);
          font-weight: 400;
        }
      }

      .name {
        margin-left: 3px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        span {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.40);
          font-weight: 400;
          
        }
      }

    }
  }

  .right {
    background: rgba(0, 0, 0, 0.30);
    border-radius: 10px;
    width: 100px;
    height: 77px;
    margin: 8px 0px;
    margin-right: 0.8%;
    background-size: cover;
    cursor: pointer;
  }
}
</style>