<template>
  <div style="font-size: 18px">
    <h3 style="text-align: center;">添加自定义按钮</h3>
    <div v-if="tab==='icon'" >
      <IconList @onSelect="setIcon"></IconList>
    </div>
    <div v-if="tab==='action'">
      <DeckAction></DeckAction>
    </div>
    <div v-if="tab==='input'">
      <div class="line">
        <a-input v-model:value="title" size="large" placeholder="输入按钮名称"></a-input>
      </div>
      <div class="line">图标</div>
      <div style="padding-left: 1em"><span style="margin-right: 1em"><CustomIcon  v-if="icon" style="font-size: 60px" :icon="icon"></CustomIcon>
      <a-avatar v-else :size="60"></a-avatar></span>
        <div class="btn" @click="tab='icon'">选择图标</div></div>
      <div class="line">功能</div>
      <div>
        <a-button @click="tab='action'">添加</a-button>
      </div>
      <div></div>
    </div>
  </div>
  <div style="text-align: center">
    <a-button type="primary" @click="doAdd">添加</a-button>
  </div>
</template>

<script>
import IconList from '../../../components/comp/IconList.vue'
import CustomIcon from '../../../components/comp/CustomIcon.vue'
import DeckAction from '../../../components/comp/DeckAction.vue'
import {message} from 'ant-design-vue'
export default {
  name: 'DeckAdd',
  emits:['add'],
  data(){
    return{
      tab:'input',
      showIconList:false,
      icon:null,
      title:'',
      fn:[]//功能
    }
  },
  components: { DeckAction, CustomIcon, IconList },
  methods:{
    setIcon(icon){
      console.log(icon)
      this.icon=icon
      this.tab='input'
    },
    doAdd(){
      if(!this.title){
        message.error('请输入按钮名称')
        return
      }
      if(this.icon===null){
        message.error('请选择图标')
        return
      }
      let button={
        title:this.title,
        icon:this.icon,
        fn:this.fn,
        id:Date.now()
      }
      this.$emit('add',button)
    }
  }
}
</script>

<style scoped>
.line{
  margin-top: 1em;
  margin-bottom: 1em;
}
</style>
