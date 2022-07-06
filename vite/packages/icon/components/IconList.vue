<script lang="ts">
import twoColor from '../../../public/iconLists/twoColor.json'
import fruit from '../../../public/iconLists/fruit.json'
import animal from '../../../public/iconLists/animal.json'
import jingling from '../../../public/iconLists/jingling.json'
import {CloseOutlined,CheckOutlined} from '@ant-design/icons-vue'
const ipc = eval('require')('electron').ipcRenderer
export default {
  components: {CloseOutlined,CheckOutlined},
  data() {
    return {
      callerId:0,
      activeKey: 'twoColor',

      iconLists: [
        twoColor,
        fruit,
        animal,
        jingling
      ],
      args: {
        shape:'square',
        text:false,
      },
      selectedIcon:{

      },
      defaultIcon:{
        type:'icon',
        icon:{

        }
      },
      defaultText:'',
      inputText:'',
      changed:false,
      originalIcon:'',
    }
  },
  mounted(){
    this.getCaller()
    ipc.on('show',()=>{
      this.getCaller()
    })
  },
  methods: {
    close(){
      ipc.send('closeSelf')
    },
    onChanged(){
      if(this.inputText!==this.defaultText){
        this.changed=true
      }
    },
    clearIcon(){
      this.selectedIcon={
        type:'img',
        url:this.originalIcon
      }
      this.changed=true
    },
    getCaller(){
      this.changed=false
      ipc.invoke('getPopArgs').then(args=>{
        this.args=args
        if(!!!args.shape || args.shape==='none'){
          this.args.shape='square'
        }
        this.defaultText=args.defaultText
        this.defaultIcon=args.defaultIcon
        this.inputText=args.defaultText
        this.originalIcon=args.originalIcon //最原始的图标
        if(args.defaultIcon.type==='fontIcon'){
          this.selectedIcon=this.parseFontIcon(args.defaultIcon.icon)
        }else{
          this.selectedIcon=this.defaultIcon
        }
        this.$nextTick(()=>{
          document.getElementById('textInput').select()
        })
      })
      ipc.invoke('getPopCallerId').then((data)=>{
        this.callerId=data
      })
    },
    parseFontIcon(userIcon){
      let iconPath=userIcon.split('.')
      return {
        list:iconPath[1],
        type:'fontIcon',
        name:iconPath[2]
      }
    },
    done(){
      let icon={}
      if(!!this.selectedIcon){
        icon=JSON.parse(JSON.stringify(this.selectedIcon))
      }
      ipc.sendTo(this.callerId, 'selectedIcon',{
        icon:icon,
        text:JSON.parse(JSON.stringify(this.inputText))
      })
      ipc.send('closeSelf')
    },
    selectIcon(icon,iconList) {
      this.changed=true
      let selectedIcon={
        list:iconList.key,
        name:icon.name,
        type:'fontIcon',
        alias:icon.alias
      }
      this.selectedIcon=selectedIcon
      if(this.args.text){
        return
      }else{
        ipc.sendTo(this.callerId, 'selectedIcon',{
          icon:selectedIcon
        })
      }

    }
  }
}
</script>

<template>
  <div v-if="this.args.text" style="margin-bottom: 10px;padding-top: 10px;width: 100%">
    <a-row  style="padding: 4px;" >
      <a-col class="set-icon" flex="60px" style="text-align: center">
        <a-avatar v-if="this.selectedIcon.type==='img'" :shape="args.shape" :src="selectedIcon.url"></a-avatar>
        <svg v-else style="width: 30px;height: 30px" class="icon group-icon" aria-hidden="true">
          <use v-bind:xlink:href="'#icon-'+this.selectedIcon.name"></use>
        </svg>
        <div @click="clearIcon()" class="clear-mask" :class="{'square':this.args.shape==='square'}" style="" >
          <close-outlined style="color: white;font-size: 18px;padding-top: 8px"></close-outlined>
        </div>
      </a-col>
      <a-col flex="1" style="padding-right:50px">
        <a-input @change="onChanged" v-model:value="inputText" id="textInput" size="small" placeholder="输入名称" style="width: 200px"></a-input>
        &nbsp;
      </a-col>
      <a-col flex="40px" style="text-align: center">
        <a-button v-if="changed" type="primary" @click="done"  shape="circle" size="small">
          <template #icon>
            <CheckOutlined />
          </template>
        </a-button>
<!--        <a-button @click="close"  shape="circle" size="small">-->
<!--          <template #icon>-->
<!--            <CloseOutlined />-->
<!--          </template>-->
<!--        </a-button>-->
      </a-col>
    </a-row>

  </div>
  <div class="card-container" :class="{'text':this.args.text}">
    <a-tabs type="card" v-model:activeKey="activeKey">
      <a-tab-pane :key="iconList.key" v-for="iconList in iconLists">
        <template #tab>
        <span>
           <a-tooltip placement="bottom">
         <template #title>
            <span style="user-select: none">{{ iconList.alias }}</span>
          </template>
          <svg class="icon group-icon" aria-hidden="true">
            <use v-bind:xlink:href="'#icon-'+iconList.icon"></use>
          </svg>
           </a-tooltip>
        </span>
        </template>
        <p class="group-items" style="display: flex;flex-wrap: wrap">
          <a-tooltip placement="top" v-for="icon in iconList.list">
            <template #title>
              <span style="user-select: none">{{ icon.alias }}</span>
            </template>
        <div @click="selectIcon(icon,iconList)">
          <svg class="icon" aria-hidden="true">
            <use v-bind:xlink:href="'#icon-'+icon.name"></use>
          </svg>
        </div>
        </a-tooltip>
        </p>
      </a-tab-pane>
      <!--      <a-tab-pane key="2">-->
      <!--        <template #tab>-->
      <!--        <span>-->
      <!--          <android-outlined/>-->
      <!--        上传-->

      <!--        </span>-->
      <!--        </template>-->
      <!--        上传-->
      <!--      </a-tab-pane>-->
    </a-tabs>
  </div>
</template>
<style>
html{
  overflow: hidden;
}
.card-container p {
  margin: 0;
}
.text.card-container > .ant-tabs-card .ant-tabs-content {
  height: calc(100vh - 107px);
}
.card-container > .ant-tabs-card .ant-tabs-content {
  height: calc(100vh - 45px);
  margin-top: -16px;
  overflow-y: auto;
  background: #fff;
}

.card-container > .ant-tabs-card .ant-tabs-content > .ant-tabs-tabpane {
  padding: 16px;

}

.card-container > .ant-tabs-card > .ant-tabs-nav::before {
  display: none;
}

.card-container > .ant-tabs-card .ant-tabs-tab,
[data-theme='compact'] .card-container > .ant-tabs-card .ant-tabs-tab {
  background: transparent;
  border-color: transparent;
}

.card-container > .ant-tabs-card .ant-tabs-tab-active,
[data-theme='compact'] .card-container > .ant-tabs-card .ant-tabs-tab-active {
  background: #fff;
  border-color: #fff;
}

#components-tabs-demo-card-top .code-box-demo {
  padding: 24px;
  overflow: hidden;
  background: #f5f5f5;
}

[data-theme='compact'] .card-container > .ant-tabs-card .ant-tabs-content {
  height: 120px;
  margin-top: -8px;
}

[data-theme='dark'] .card-container > .ant-tabs-card .ant-tabs-tab {
  background: transparent;
  border-color: transparent;
}

[data-theme='dark'] #components-tabs-demo-card-top .code-box-demo {
  background: #000;
}

[data-theme='dark'] .card-container > .ant-tabs-card .ant-tabs-content > .ant-tabs-tabpane {
  background: #141414;
}

[data-theme='dark'] .card-container > .ant-tabs-card .ant-tabs-tab-active {
  background: #141414;
  border-color: #141414;
}
</style>
<style scoped lang="scss">
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.group-icon {
  width: 1.6em;
  height: 1.6em;
  outline: none;
}

.group-items > div svg {
  width: 2em;
  height: 2em;
  transition: all 0.6s;
  cursor: pointer;

  &:hover {
    transform: scale(1.4);
  }
}

.group-items > div {
  padding: 5px;
}

.scrollbar {

}
.set-icon{
  &:hover{
    .clear-mask{
      visibility: visible;
    }
  }
}
.clear-mask{
  visibility: hidden;
  &.square{
    border-radius: 4px;
  }
  border-radius: 50%;
  position:absolute;background:rgba(0,0,0,0.51);width: 30px;height: 30px;top: 0;left:calc(50% - 15px)
}

</style>
