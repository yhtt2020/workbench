<template>
  <div class="flex flex-row justify-between items-center">
    <div class="text-white ">
      <span class="mr-2">分屏管理</span>
    </div>
    <div @click.stop="" class="h-10 w-28 bg-gray-800 rounded-lg flex justify-evenly items-center pointer">
      <Icon icon="minus-circle-fill "></Icon>
      关闭分屏
    </div>
  </div>
  <div @click.stop style="background: #111;border: 1px solid #333" class="p-3 rounded-md mt-3">

    <div @click="click(screen)" :class="{die:!screen.running,active:screen.active}" v-for="screen in list" class="pointer screen rounded-sm" style="display: inline-block;position: relative">
      <img class="" style="width: 120px;height:80px;" src="/screen.jpg">
      <span style="position: absolute;bottom: 0;right: 0;color: white" class="p-2">{{ screen.title }}</span>
    </div>
    <div class="text-right mt-2">
      <a-button class="mr-3">创建</a-button>
      <a-button>辨别</a-button>
    </div>
  </div>
  <div class="p-3" @click.stop>
    <div class="line-title">
      选中： 游戏分屏
    </div>
    <div class="line">
      <a-switch></a-switch>
      启用分屏
    </div>
    <div class="line">
      <a-switch></a-switch>
      自启动
    </div>
    <div class="line">
      <a-button type="primary">设置屏幕</a-button>
    </div>
    <div class="line">
      <a-button type="primary">设置分屏</a-button>
    </div>
  </div>
</template>

<script>
import { mapWritableState } from 'pinia'
import { screenStore } from '../../store/screen'
import _ from 'lodash-es'
export default {
  name: 'ScreenManage',
  data(){
    return {
      list:[]
    }
  },
  computed: {
    ...mapWritableState(screenStore, ['screens']),

  },
  mounted () {
    this.list=_.cloneDeep(this.screens)
    this.list[0].active=true
  },
  methods:{
    click(screen){
      this.list.forEach(s=>{
        s.active=false
      })
      screen.active=true
    }
  }
}
</script>

<style scoped lang="scss">
.screen {
  opacity: 0.7;

  & > img {
    object-fit: scale-down;
  }

  cursor: pointer;

  &:hover {
    border: rgba(255, 255, 255, 0.56) 2px solid;
    opacity: 0.9;
  }
}

.screen.die {
  & > img {
    filter: grayscale(100%);
  }

  opacity: 0.7
}

.screen.active {
  border: white 2px solid;
  opacity: 1;
}
</style>
