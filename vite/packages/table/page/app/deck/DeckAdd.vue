<template>
  <div style="font-size: 18px;height: 500px;overflow-y: auto">
    <h3 style="text-align: center;">
      <span v-if="!this.data">
       添加自定义按钮
      </span>
      <span v-else>
        编辑 - {{this.data.title}}
      </span>
    </h3>
    <div v-if="tab==='icon'">
      <IconList @onSelect="setIcon"></IconList>
    </div>
    <div v-if="tab==='action'">
      <DeckAction :data="editingAction" ref="_deckAction" @click="doAddAction"></DeckAction>
    </div>

    <div v-if="tab==='input'">

      <div class="line preview" style="text-align: center">
        <div class="line-title" style="padding: 1em;text-align: center;">
          效果预览
        </div>
        <div class="item-wrapper">


        <div v-if="type==='font'">

          <div class="text-icon" :style="{'font-size':iconFontSize+'px',color:this.color,'background':this.bgColor}">
            {{ iconText }}
          </div>
        </div>
        <div v-else>
          <CustomIcon v-if="icon" style="font-size: 60px;margin-top: 0.15em"
                      :icon="icon"></CustomIcon>
        </div>
        </div>
        <div style="text-align: center;margin-top: 1em;margin-right: 0">
          <a-button v-if="!this.data" type="primary" @click="doAdd" style="width: 8em">添加按钮</a-button>
          <a-button v-else type="primary" @click="doAdd">
            保存按钮
          </a-button>
        </div>
      </div>
      <div class="line-title">
        名称
      </div>
      <div class="line">
        <a-input @change="syncTitle" style="width: 20em" v-model:value="title" size="large" placeholder="输入按钮名称"></a-input>
      </div>
      <div class="line-title ">图标</div>
      <div class="line">
        <a-radio-group v-model:value="type">
          <a-radio value="icon">
            图标按钮
          </a-radio>
          <a-radio value="font">
            文字按钮
          </a-radio>
        </a-radio-group>
      </div>

      <div v-if="type==='font'">
        <div class="line">
          按钮文字： <a-input style="width: 20em" v-model:value="iconText" placeholder="输入文字"></a-input>
        </div>
        <div class="line">
         字体大小： <a-input-number placeholder="字体大小" v-model:value="iconFontSize"></a-input-number>
        </div>
        <div class="line">
         文字颜色：  <colorPicker  v-model="color" />
        </div>
        <div class="line">
         背景颜色： <colorPicker  v-model="bgColor" />
        </div>

      </div>

      <div v-else class="line"><span style="margin-right: 1em"><CustomIcon v-if="icon" style="font-size: 60px"
                                                                                 :icon="icon"></CustomIcon>

      <a-avatar v-else :size="60"></a-avatar></span>

        <div class="btn" @click="tab='icon'">选择图标</div>
      </div>
      <div class="line-title">功能</div>
      <div class="line">
        <div  @click="editAction(data)" :style="{'border-left-color':data.group.color}" v-for="(data,index) in actions" class="action">
          {{ data.action.title}}
           <Icon class="close-btn" @click.stop="removeAction(index)"  style="font-size: 15px" icon="guanbi1"></Icon>
        </div>
        <a-button @click="addAction" >添加</a-button>

      </div>
      <div></div>
    </div>
  </div>

</template>

<script>
import IconList from '../../../components/comp/IconList.vue'
import CustomIcon from '../../../components/comp/CustomIcon.vue'
import DeckAction from '../../../components/deck/DeckAction.vue'
import { message } from 'ant-design-vue'
export default {
  name: 'DeckAdd',
  emits: ['add'],
  props:['data'],
  data () {
    return {
      tab: 'input',
      type: 'icon',
      iconFontSize:20,
      iconText: '',
      showIconList: false,
      color:'#ffffff',
      bgColor:'#0A83FDFF',

      icon: null,
      title: '',
      actions: [],//功能

      id:0,

      editingAction:{}//正在编辑中的action

    }
  },
  mounted () {
    if(this.data){
      /**
       * {
       *         title: this.title,
       *         icon: this.icon,
       *         font:{
       *           size:this.iconFontSize,
       *           text:this.iconText,
       *           color:this.color,
       *           bgColor:this.bgColor
       *         },
       *         actions: this.actions,
       *         id: Date.now(),
       *         type: this.type
       */
      this.title=this.data.title
      this.icon=this.data.icon
      this.iconFontSize=this.data.font.size
      this.iconText=this.data.font.text
      this.color=this.data.font.color
      this.bgColor=this.data.font.bgColor
      this.actions=this.data.actions
      this.id=this.data.id
      this.type=this.data.type
      console.log(this.data,'data')
    }
  },
  components: { DeckAction, CustomIcon, IconList },
  methods: {
    removeAction(index){
      this.actions.splice(index,1)
    },
    editAction(action){
      this.tab='action'
      this.editingAction=action
      this.$nextTick(()=>{
        this.$refs._deckAction.reset()

      })
    },
    addAction(){
      this.tab='action'
      this.editingAction=undefined
      this.$nextTick(()=>{
        this.$refs._deckAction.reset()
      })

    },
    doAddAction(actionData){
      this.tab='input';
      if(this.editingAction){
        if(actionData){
         let foundIndex= this.actions.findIndex(a=>{
            return a===this.editingAction
          })
          this.actions.splice(foundIndex,1)
          this.actions.splice(foundIndex,0,actionData)
          this.editingAction={}
        }
      }else{
        if(actionData){
          this.actions.push(actionData)
        }
      }

    },
    setIcon (icon) {
      console.log(icon)
      this.icon = icon
      this.tab = 'input'
    },
    doAdd () {
      if (!this.title) {
        message.error('请输入按钮名称')
        return
      }
      if(this.type==='icon'){
        if (this.icon === null) {
          message.error('请选择图标')
          return
        }
      }else{
        if(this.iconText===''){
          message.error('请输入按钮文字')
        }
      }

      let button = {
        title: this.title,
        icon: this.icon,
        font:{
          size:this.iconFontSize,
          text:this.iconText,
          color:this.color,
          bgColor:this.bgColor
        },
        actions: this.actions,
        id: this.id||Date.now(),
        type: this.type
      }
      this.$emit('add', button)
    },
    syncTitle(value){
      this.iconText=this.title
    }
  }
}
</script>

<style scoped lang="scss">
.line {
  margin-top: 1em;
  margin-bottom: 1em;
}
.preview{
  position: absolute;
  right: 10em;
  top: 5em;

  text-align: center;
  display: inline-block;
  vertical-align: middle;
}
.item-wrapper{
  display: inline-block;

  width: 80px;
  height:80px;
  background: rgba(128, 128, 128, 0.34);
  border-radius: 0.3em;
  svg{
    vertical-align: middle;
  }
}
.close-btn{
  &:hover{
    background: red;
    color:white;
    border-radius: 2px;

  }
}
</style>
