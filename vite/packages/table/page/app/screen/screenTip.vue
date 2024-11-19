<template>
  <div class="fixed overflow-hidden modal-center xt-modal tran" style="">
    <div class="title">
      <MyIcon icon="fluent-emoji-flat:desktop-computer" width="24" height="24" />
      <span>检测到工作台所在屏幕发生变化</span>
    </div>
    <div class="top cursor-pointer" @click="close">
      <MyIcon icon="fluent:dismiss-16-filled" width="14" height="14" color="#212121" />
    </div>
    <div class="content">
      工作台位置变化，可选择需要使用的记忆位置，或选择新增记忆保存为常用位置。（可记录位置、大小、全屏状态和缩放比例）
    </div>
    <div class="tab-list">
      <div class="tab select" :style="{marginLeft: index>0?'8px':0}" v-for="(item, index) in screenList"
      :key="index">
        <xt-mix-menu :menus="menuList" @mounted="currentIndex = index">
          <div class="flex items-center h-full" @click="setScreen(item)" style="flex-direction: column;">
            <MyIcon icon="fluent:desktop-16-regular" width="24" height="24" color="rgba(255,255,255,0.85)" style="margin-top: 20px" />
            <span>{{ item.title }}</span>
          </div>
        </xt-mix-menu>
      </div>
      <div class="tab add" v-if="screenList.length<3" :style="{marginLeft: screenList.length !== 0?'8px':0}" @click="add">
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
    }
  },
  props: {
  },
  computed: {
    ...mapWritableState(screenStore, ["screenTip", 'screenList', 'addScreen', 'renameScreen', 'renameIndex']),
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
    add(){
      this.addScreen = true
    },
    close(){
      this.screenTip = false
    },
    setScreen(item){
      tsbApi.window.setBounds({
        x: item.position[0],
        y: item.position[1],
        width: item.width,
        height: item.height
      })

      setTimeout(()=>{
        this.screenTip = false
      },500)
    }

  },
}
</script>

<style lang="scss" scoped>
.modal-center {
  background: #212121;
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.03);box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.1);box-shadow: 0px 0px 40px 0px rgba(0,0,0,0.2);
  border-radius: 12px;
  right: 12px;
  bottom: 76px;
  // height: 260px;
  width: 320px;
  padding: 16px 16px 12px;

  .title{
    display: flex;
    align-items: center;
    span{
      margin-left: 12px;
      font-size: 16px;
      color: rgba(255,255,255,0.85);
      font-weight: 500;
    }
  }
  .content{
    margin-top: 12px;
    font-size: 16px;
    color: rgba(255,255,255,0.60);
    font-weight: 400;
  }
  .tab-list{
    margin-top: 12px;
    display: flex;
    .tab{
      height: 96px;
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
      width: 92px;
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
