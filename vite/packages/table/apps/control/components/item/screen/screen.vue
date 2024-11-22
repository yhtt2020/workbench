<template>
  <div class="flex items-center w-full h-full">
    <div class="tab-list">
      
      <div class="tab select relative xt-mask" :style="{marginLeft: index>0?'8px':0}" v-for="(item, index) in screenList"
      :key="index">
        <xt-mix-menu :menus="menuList" @mounted="currentIndex = index" :beforeCreateFn="beforeCreateFn">
          <div class="flex items-center h-full" @click="setScreen(item)" style="flex-direction: column;">
            <MyIcon icon="fluent:desktop-16-regular" width="24" height="24" color="rgba(255,255,255,0.85)" style="margin-top: 22px" />
            <span>{{ item.title }}</span>
            <div class="mask h-full w-full absolute"></div>
            <div class="change absolute" @click="setScreen(item)">读取</div>
            <div class="save absolute" @click="saveScreen(index)">写入</div>
          </div>
        </xt-mix-menu>
      </div>
      <div class="tab add xt-mask"  v-if="screenList.length<3" :style="{marginLeft: screenList.length !== 0?'8px':0}" @click="add">
        <MyIcon icon="fluent:add-20-filled" width="24" height="24" color="rgba(255,255,255,0.85)" />
      </div>
    </div>

  </div>
</template>

<script>
import { screenStore } from "../../../../../store/screen";
import { mapWritableState, mapActions } from 'pinia';
import { Icon as MyIcon } from '@iconify/vue';

export default {
  components: {
    MyIcon,
  },
  data() {
    return {
      currentIndex: 0,
    }
  },
  props: {
    isClick: {
      type: Boolean,
      default: false
    },
  },
  computed: {
    ...mapWritableState(screenStore, ["screenTip", 'screenList', 'renameScreen', 'renameIndex', 'currentScreen']),
    menuList(){
      return [
        {
          name: "重命名",
          newIcon: "fluent:open-16-regular",
          fn: () => {
            this.renameScreen = true
            this.renameIndex = this.currentIndex
          },
        },
        {
          name: "删除",
          newIcon: "fluent:delete-16-regular",
          fn: () => {
            window.$ui.confirm(`确定删除 ${this.screenList[this.currentIndex]?.title} 吗？`, "", {
              type: "warning",
              ok: ()=>{
                this.screenList.splice(this.currentIndex, 1)
              },
            });
          },
        },
      ]
    }
  },
  mounted() {
  },

  watch: {
  },
  methods: {
    ...mapActions(screenStore, ["setScreenBounds", "addScreen"]),
    beforeCreateFn(){
      if(this.isClick){
        return true
      }else{
        return false
      }
    },
    add(){
      if(this.isClick){
        this.addScreen()
      }
    },
    setScreen(item){
      if(this.isClick){
        const bounds = {
          x: item.position[0],
          y: item.position[1],
          width: item.width,
          height: item.height
        }
        this.setScreenBounds(bounds)
      }
    },
    saveScreen(index){
      this.screenList[index] = {
        ...this.screenList[index],
        ...this.currentScreen,
      }
      this.$message.success("写入成功");
    },

  },
}

</script>

<style lang="scss" scoped>
.gray{
  filter: grayscale(100%);
}
.tab-list{
    padding: 12px;
    display: flex;
    height: 100%;
    width: 100%;
    .tab{
      height: 100%;
      border-radius: 12px;
      display: flex;
      align-items: center;
      flex-direction: column;
      cursor: pointer;
      font-size: 14px;
      // background: rgba(0,0,0,0.30);
      font-weight: 400;
      height: 100%;
      span{
        margin-top: 8px;
      }

    }
    .select{
      color: rgba(255,255,255,0.85);
      // width: 92px;
      flex: 1 1 0;      overflow: hidden;
      .mask{
        display: block;
        background: rgba(0,0,0,0.30);
        display: none;
        transition: all 0.5s linear;
        backdrop-filter: blur(5px);
      }
      .change{
        // top: 10px;
        top: -80px;
        transition: all 0.2s linear;
        background:rgba(80,139,254,1);
        width: 90%;
        margin: 0 auto;
        height: 51px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
      }
      .save{
        bottom: -30px;
        transition: all 0.2s linear;
        background:rgba(250,173,20,1);
        width: 90%;
        margin: 0 auto;
        height: 26px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
      }
      &:hover{
        .mask{
          display: block
        }
        .change{
          top: 6px;
        }
        .save{
          bottom: 6px;
        }
      }
    }
    .add{
      color: rgba(255,255,255,0.65);
      height: 100%;
      width: 40px;
      display: flex;
      justify-content: center;
    }
  }
</style>
