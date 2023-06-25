<template>
  <!-- 游戏攻略组件 -->
  <Widget :options="options" :customData="customData" :customIndex="customIndex" :desk="desk">
    <!-- 游戏名称 -->
    <div class="game-name rounded-lg px-3 py-1 pointer">
      游戏攻略-小缇娜的奇幻之地
    </div>
    <!--按钮操作设置 -->
    <div class="w-full flex my-3.5">
      <HorizontalPanel style="width: 376px;height: 44px;" :navList="strategyType" v-model:selectType="defaultStrategy"></HorizontalPanel>
      <div class="mx-3 flex rounded-lg  w-11 h-11 items-center button-active justify-center search-button">
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
      视频攻略
    </template>

    <template v-else>
      图文攻略
    </template>
  </Widget>

  
</template>

<script>
import Widget from '../../card/Widget.vue';
import HorizontalPanel from '../../HorizontalPanel.vue';
export default {
  name:'GameStrategy',   
  components:{ Widget, HorizontalPanel },
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
  methods:{

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