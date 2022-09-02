<template>
  <div style="text-align: center;padding-top: 70px">
    <a-avatar :size="80" src="/icons/logo128.png"></a-avatar>
    <h3 style="margin-top: 15px">欢迎使用想天浏览器</h3>
    <p>版本：3.2.3</p>
    <p>
      <a-button type="primary">打开上次空间</a-button>
    </p>

  </div>
  <div style="position: absolute;bottom: 20px;text-align: center;width: calc( 100% - 200px) ">
    <div>
      <a-checkbox @change="switchShowOnStart" v-model:checked="showOnStart">每次启动的时候选择</a-checkbox>
    </div>
    <div class="tip" style="">
      <a-row type="flex">
        <a-col flex="60px">
          <a-avatar shape="square" src="/icons/bilibili.svg" :size="50"/>
        </a-col>
        <a-col flex="1">
          <h3>快速学习空间功能</h3>
          <div>
            通过视频教程，系统学习掌握空间的使用技巧。强烈推荐。
            <close-outlined style="position: absolute;right: 5px;top: 5px;cursor: pointer"/>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { CloseOutlined } from '@ant-design/icons-vue'
const {configModel} = window.$models
export default {
  name: 'Welcome',
  components: { CloseOutlined },
  async mounted () {
    this.showOnStart = await configModel.getShowOnStart()
  },
  data(){
    return {
      showOnStart:false
    }
  },
  methods:{
    switchShowOnStart () {
      configModel.setShowOnStart(this.showOnStart)
    },
  }
}
</script>

<style scoped lang="scss">
.tip {
  &:hover{
      box-shadow: 0 0 8px rgba(101, 96, 96, 0.3);
   }
  border-radius: 4px;
  border: 1px solid #f1f1f1;
  background: #f5f5f5;
  display: inline-block;
  width: 500px;
  margin-top: 10px;
  text-align: left;
  padding: 10px
}
</style>
