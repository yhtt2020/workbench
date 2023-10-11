<template>
    <div style='width:400px;height:400px;background: #212121;border: 1px solid rgba(255,255,255,0.1);box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.5);border-radius: 10px;' class="float-icon">
      <div class="top-icon flex">
        <div class="type-select flex">
          <span @click="onSelChange(1)" :class="selIndex == 1 ? 'active':''">Emojis</span>
          <span @click="onSelChange(2)" :class="selIndex == 2 ? 'active':''">Icons</span>
          <span @click="onSelChange(3)" :class="selIndex == 3 ? 'active':''">自定义</span>
        </div>
        <div class="back">移出</div>
      </div>
      <div class="action-search pl-3 pr-3 pt-3 flex" style="justify-content: space-between;">
        <a-input
          style="width:280px;height:40px;background: #191919;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;"
          placeholder="搜索"
        />
        <div class="flex justify-center items-center" style="width: 40px;height:40px;background: #2A2A2A;border-radius: 10px;">
          <Icon class="pointer" :icon="icons.arrowSync20Filled"  width="20" height="20"/>
        </div>
        <div class="flex justify-center items-center" style="width: 40px;height:40px;background: #2A2A2A;border-radius: 10px;">
          <Icon class="pointer" :icon="icons.arrowSync20Filled"  width="20" height="20"/>
        </div>
      </div>
      <div class="icon-list flex pl-1 pr-2" style="flex-wrap: wrap;">
        <div v-for="index in 48" :key="index" @click="onSelectIcon(index)" class="flex justify-center items-center mt-2 ml-2" style="width: 40px;height:40px;border-radius: 10px;" :class="selectIcon == index ? 'sel-active':''">
          <Icon class="pointer" :icon="icons.arrowSync20Filled"  width="20" height="20"/>
        </div>
      </div>

    </div>


</template>
  
  <script>
  import { Icon } from '@iconify/vue';
  import arrowSync20Filled from '@iconify-icons/fluent/arrow-sync-20-filled';
  export default {
    name: "SelectIcon",
    components: {
      Icon
    },
    data() {
      return {
        selIndex:1,
        searchValue:'',
        selectIcon:1,
        icons:{
          arrowSync20Filled
        },
        // release: false,
      }  
    },
    props: {
    },
    
    methods: {
      // 选择图标类型
      onSelChange(n){
        this.selIndex = n
      },
      // 选择第几个图标
      onSelectIcon(n){
        this.selectIcon = n
      },

    },
  }
  </script>
  
  <style lang="scss" scoped>

  .float-icon{
    position: absolute;
    z-index: 100;
    top: 50%;
  }
    .top-icon{
      height: 48px;
      border-bottom: 1px solid rgba(255,255,255,0.10);
      padding: 0 16px;
      justify-content: space-between;
    }

    .top-icon .type-select{
      
    }
    
    .top-icon .type-select span{
      display: flex;
      height: 48px;
      font-family: PingFangSC-Semibold;
      font-size: 14px;
      color: rgba(255,255,255,0.85);
      font-weight: 400;
      align-items: center;
      margin-right: 16px;
      cursor: pointer;
      border-bottom: 2px solid transparent;
    }

    .top-icon .back{
      display: flex;
      align-items: center;
      cursor: pointer;

    }
    
    .active{
      font-weight: 600 !important;
      border-bottom: 2px solid #508BFE !important;
      border-radius: 2px;
    }

    .sel-active{
      background: #2A2A2A;
    }

  </style>
  