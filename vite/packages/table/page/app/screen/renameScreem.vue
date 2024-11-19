<template>
    <!-- 新增桌面记忆弹窗 -->
    <xt-modal title="桌面记忆重命名" :index="1002" boxClass="rounded-xl p-4" :mask="false" :header="true" :footer="true" v-model="renameScreen" v-if="renameScreen" @ok="handleOk" >
      <div class="relative xt-modal rounded-xl" style="width: 500px; height: 100%;" >
         <div class="title p-4">记住您的工作台位置、缩放等设置，在屏幕发生变化时，可以快速切换需要使用的记忆模式。</div>
         <div class="content p-4">
          <div class="name">名称</div>
          <div class="box">
            <a-input
              class="h-10 xt-mask xt-text"
              style="
                margin-top: 12px;
                background: #191919;
                border: 1px solid rgba(255, 255, 255, 0.1);
                /* padding: 10px 12px; */
                border-radius: 10px;
              "
              placeholder="请输入名称"
              :maxlength="10"
              :allow-clear="false"
              spellcheck="false"
              v-model:value="screen_name"
            >
            </a-input>
          </div>
         </div>
      </div>
    </xt-modal>
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
      screen_name: '',
    }
  },
  props: {
  },
  computed: {
    ...mapWritableState(screenStore, ["screenTip", 'screenList', 'currentScreen', 'renameScreen', 'renameIndex']),
  },
  mounted() {
    this.screen_name = this.screenList[this.renameIndex]?.title
  },

  watch: {
  },
  methods: {
    handleOk(){
      if(this.screen_name){
            window.$ui.confirm(`确定重命名 ${this.screenList[this.renameIndex]?.title} 吗？`, "", {
              type: "warning",
              ok: ()=>{
                this.screenList[this.renameIndex].title = this.screen_name
                this.$message.success("重命名成功");
                this.renameScreen = false
              },
            });
        
      }else{
        this.$message.error("请输入桌面记忆名称");
      }
      
    },
  },
}
</script>

<style lang="scss" scoped>
  .title{
    font-size: 14px;
    color: hsla(0, 0%, 100%, 0.85);
    // font-weight: 600;
    background: #2A2A2A;
    border-radius: 10px;
    width: 100%;
  }
  .content{
    margin-top: 12px;
    background: #2A2A2A;
border-radius: 12px;
width: 100%;
    .name{
      font-size: 16px;
      color: rgba(255,255,255,0.85);
      font-weight: 400;
    }
    .box{
      width: 100%;
    }
  }

</style>
