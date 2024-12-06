<template>
  <div class="fixed overflow-hidden modal-center xt-modal" ref="screenTip" :class="{tran: isTran, open: isOpen}"
    @mouseenter="changeActive" 
    @mouseleave="removeActive" 
    style="z-index: 999999;">
    <div class="title">
      <MyIcon icon="fluent-emoji-flat:desktop-computer" width="24" height="24" />
      <span class="xt-text">检测到工作台所在屏幕发生变化</span>
    </div>
    <div class="top cursor-pointer" @click="close">
      <MyIcon icon="fluent:dismiss-16-filled" width="14" height="14" color="#212121" />
    </div>
    <div class="content xt-text-2">
      工作台位置变化，可选择需要使用的记忆位置，或选择新增记忆保存为常用位置。（可记录位置、大小、全屏状态和缩放比例）
    </div>
    <div class="tab-list">
      <div class="tab select relative tt-mask-bg " :style="{marginLeft: index>0?'8px':0}" v-for="(item, index) in screenList"
      :key="index">
        <xt-mix-menu :menus="menuList" @mounted="currentIndex = index">
          <div class="flex items-center h-full" style="flex-direction: column;">
            <MyIcon icon="fluent:desktop-16-regular" width="24" height="24" color="rgba(255,255,255,0.85)" style="margin-top: 20px" />
            <span>{{ item.title }}</span>
            <div class="mask h-full w-full absolute"></div>
            <div class="change absolute" @click="setScreen(item)">读取</div>
            <div class="save absolute" @click="saveScreen(index)">写入</div>
          </div>
        </xt-mix-menu>
      </div>
      <div class="tab add tt-mask-bg " v-if="screenList.length<3" :style="{marginLeft: screenList.length !== 0?'8px':0}" @click="add">
        <MyIcon icon="fluent:add-20-filled" width="24" height="24" style="margin-top: 20px" />
        <span>新增记忆</span>
      </div>

    </div>
  </div>
</template>

<script>
import { mapWritableState, mapActions } from 'pinia';
import { appStore } from '../../../store';
import { Icon as MyIcon, listIcons } from '@iconify/vue';
import { screenStore } from "../../../store/screen";

export default {
  components: {
    MyIcon,
  },
  data() {
    return {
      currentIndex: 0,
      isTran: false,
      isOpen: false,
      timer: null,
    }
  },
  props: {
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
    setTimeout(()=>{
      this.isOpen = true
    },300)
    this.timer = setTimeout(()=>{
      this.close()
    }, 10000)
    
  },
  unmounted() {
    this.close()
  },

  watch: {
  },
  methods: {
    ...mapActions(screenStore, ["setScreenBounds", "addScreen"]),
    changeActive(){
      clearTimeout(this.timer)
      this.timer = null
    },
    removeActive(){    
      this.timer = setTimeout(()=>{
        this.close()
      }, 10000)
    },
    add(){
      this.addScreen()
    },
    close(){
      this.isTran = true
      setTimeout(()=>{
        this.screenTip = false
        clearTimeout(this.timer)
        this.timer = null
      },300)
    },
    setScreen(item){
      const bounds =  {
        x: item.position[0],
        y: item.position[1],
        width: item.width,
        height: item.height
      }
      this.setScreenBounds(bounds)
    },
    saveScreen(index){
      window.$ui.confirm(`是否确定覆盖当前桌面记忆`, "", {
        type: "warning",
        ok: ()=>{
          this.screenList[index] = {
            ...this.screenList[index],
            ...this.currentScreen,
          }
          this.$message.success("写入成功");
        },
      });
    },

  },
}
</script>

<style lang="scss" scoped>
.tran{
  transform: translateX(500px);
}
.open{
  right: 16px !important;
}
.modal-center {
  background: #212121;
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.03);box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.1);box-shadow: 0px 0px 40px 0px rgba(0,0,0,0.2);
  border-radius: 12px;
  right: -500px;
  bottom: 76px;
  // height: 260px;
  width: 350px;
  padding: 16px 16px 12px;
  transition: all 0.3s linear;

  .title{
    display: flex;
    align-items: center;
    span{
      margin-left: 12px;
      font-size: 16px;
      // color: rgba(255,255,255,0.85);
      font-weight: 500;
    }
  }
  .content{
    margin-top: 12px;
    font-size: 16px;
    // color: rgba(255,255,255,0.60);
    font-weight: 400;
  }
  .tab-list{
    margin-top: 12px;
    display: flex;
    .tab{
      height: 100px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      flex-direction: column;
      cursor: pointer;
      font-size: 14px;
      background: rgba(0,0,0,0.30);
      font-weight: 400;

      // padding-top: 20px;
      span{
        margin-top: 8px;
      }

    }
    .select{
      color: rgba(255,255,255,0.85);
      width: 100px;
      overflow: hidden;
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
        width: 84px;
        margin: 0 auto;
        height: 51px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
      }
      .save{
        bottom: -30px;
        transition: all 0.2s linear;
        background:rgba(250,173,20,1);
        width: 84px;
        margin: 0 auto;
        height: 26px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
      }
      &:hover{
        .mask{
          display: block
        }
        .change{
          top: 8px;
        }
        .save{
          bottom: 8px;
        }
      }

    }
    .add{
      color: rgba(255,255,255,0.65);
      width: 100%;
      flex: 1 1 0;
    }
  }
}
.top{
  width: 21px;
  height: 21px;
  background: #a6a6a6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 14px;
  top: 14px;

}


</style>
