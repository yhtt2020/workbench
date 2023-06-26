<template>
  <!-- 游戏攻略组件 -->
  <Widget :options="options" :customData="customData" :customIndex="customIndex" :desk="desk">
    <!-- 游戏名称 -->
    <div class="game-name rounded-lg px-3 py-1 pointer" @click="openGuideDrawer">
      游戏攻略- 
      <!-- {{ recentGameList[0].chineseName }} -->
    </div>
    <!--按钮操作设置 -->
    <div class="w-full flex my-3.5">
      <HorizontalPanel style="width: 376px;height: 44px;" :navList="strategyType" v-model:selectType="defaultStrategy"></HorizontalPanel>
      <div @click="openSearch" class="mx-3 flex rounded-lg  w-11 h-11 items-center button-active justify-center search-button">
        <Icon icon="sousuo" style="font-size: 1.24em;"></Icon>
      </div>
      <div class="flex">
        <div class="flex rounded-lg  w-11 h-11 items-center button-active justify-center search-button">
          <Icon icon="xiangzuo" style="font-size: 1.24em;"></Icon>
        </div>
        <div class="flex rounded-lg ml-3  w-11 h-11 items-center button-active justify-center search-button">
          <Icon icon="xiangyou" style="font-size: 1.24em;"></Icon>
        </div>
      </div>
    </div>
    
    <!-- 游戏攻略内容显示 -->
    <template v-if="defaultStrategy.name === 'video'">
      {{ recentGame }}
      <!-- 视频攻略 -->
    </template>

    <template v-else>
      <!-- 图文攻略 -->
    </template>
  </Widget>
  <HorizontalDrawer ref="strategyDrawer" :drawerTitle="strategyTitle"></HorizontalDrawer>
  <a-drawer v-model:visible="searchShow" title="搜索" width="500" placement="right">
     
  </a-drawer>
</template>

<script>
import Widget from '../../card/Widget.vue';
import HorizontalPanel from '../../HorizontalPanel.vue';
import HorizontalDrawer from '../../HorizontalDrawer.vue';
import { mapActions, mapWritableState } from 'pinia';
import { steamUserStore } from '../../../store/steamUser';
import _ from 'lodash-es'
export default {
  name:'GameStrategy',   
  components:{ Widget, HorizontalPanel, HorizontalDrawer },
  props:{
    customIndex: {
      type: Number,
      default: 0
    },
    customData: {
      type: Object,
      default: () => {}
    },
    confirmCCData: {
      type: Function,
      default: () => {}
    },
    desk:{
      type:Object
    }
  },
  data(){
    return{
      options: {
        className: 'card double',
        title: '',
        icon: 'trophy',
        type: 'strategy', 
      },
      strategyType:[
        {title:'视频攻略',name:'video'},
        {title:'图文攻略',name:'image-text'}
      ],
      defaultStrategy:{title:'视频攻略',name:'video'},
      searchShow:false,
      strategyTitle:'游戏名称'
    }
  },
  watch:{
    'defaultStrategy':{
      handler(){
        this.defaultStrategy = this.defaultStrategy
      },
      immediate:true,
    }
  },
  computed:{
    ...mapWritableState(steamUserStore,['recentGameList']),
    recentGame(){
      // const arr = _.filter(this.recentGameList, function(o) {
      //   return {
      //     name:o.name,
      //     id:o.appid,
      //     chineseName:o.chineseName
      //   }
      // });
      // console.log('测试',arr);
    }
  },
  methods:{
    // 打开右侧抽屉进行游戏名称切换
    openGuideDrawer(){
     this.$refs.strategyDrawer.openDrawer()
    },
    openSearch(){
      this.searchShow = true
    }
  }
  
}
</script>

<style lang="scss" scoped>
.game-name{
  position: absolute;
  left: 45px;
  top:10px;
  background: var(--primary-bg);
}

:deep(.nav-item){
  width: 50% !important;
}
.search-button{
  color: var(--primary-text);
  background: var(--secondary-bg);
  cursor: pointer;
}

.button-active{
  &:active{
    filter: brightness(0.8);
    opacity: 0.8;
  }
  &:hover{
    opacity: 0.8;
  }
}
</style>