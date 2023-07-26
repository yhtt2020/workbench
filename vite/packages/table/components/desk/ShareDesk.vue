<template>
  <a-drawer v-model:visible="showDrawer" @close="close" style="z-index:9999;" width="500" placement="right">
     <template #extra>
      <a-space>
        <div class="add-scheme" @click="addPlan">立即分享</div>
      </a-space>
    </template>
    <div>
      <span class="title">桌面</span>
      <a-select v-model:value="desk" @change="setSelectVal" style="height:48px; border:none;" 
      :bordered="false" size="large" class="input rounded-lg  text-xs flex items-center" 
      :dropdownStyle="{ 'z-index': 9999, backgroundColor: 'var(--secondary-bg)' }">
        <template #suffixIcon>
          <Icon icon="xiangyou" class="h-4 w-4" @click="delLabel(index)"></Icon>
        </template>
        <a-select-option v-for="(item,index) in deskType" :key="index" :value="index">{{ item }}</a-select-option>
      </a-select>
      <span class="title">桌面数据</span>
      <div style="font-size: 14px;" class="xt-text-2 mt-2 mb-4">选择是否需要保留你在小组件自定义编辑的设置或数据，比如「倒数日小组件」中的事件数据。</div>
      <RadioTab :navList="dataType" v-model:selectType="defaultType"></RadioTab>
      <span class="title mt-5">标题</span>
      <a-input v-model:value="shareName" spellcheck ="false" class="input" placeholder="请输入" aria-placeholder="font-size: 16px;"/>
      <span class="title">简介</span>
      <a-textarea v-model:value="blurb" spellcheck="false" class="input xt-text"  placeholder="请输入" aria-placeholder="font-size: 16px;" style="height: 100px;"/>
      <span class="title">分类</span>
      <a-select v-model:value="assort" style="height:48px;border:none;" :bordered="false" size="large" 
      class="input rounded-lg  text-xs flex items-center" 
      :dropdownStyle="{ 'z-index': 9999, backgroundColor: 'var(--secondary-bg)' }">
        <template #suffixIcon>
          <Icon icon="xiangyou" class="h-4 w-4" @click="delLabel(index)"></Icon>
        </template>
        <a-select-option v-for="(item,index) in assortList" :key="item" :value="index">{{ item }}</a-select-option>
      </a-select>

      <!-- <div class="flex justify-between items-center">
        <span class="title">隐私保护</span>
        <a-switch v-model:checked="secretSwitch" aria-checked="false"/>
      </div> -->
      <!-- <div style="font-size: 14px;" class="xt-text-2 mt-2 mb-4">你的隐私信息是否需要分享，例如便签等</div> -->
      <span class="title">标签</span>
      <div style="font-size: 14px;" class="xt-text-2 mt-2">最多添加四个标签</div>
      <div class="flex my-4">
        <a-input v-model:value="labelVal" spellcheck ="false" class="input" style="width:340px;margin:0" placeholder="请输入" aria-placeholder="font-size: 16px;"/>
        <div class="add-label" @click="addLabel">添加</div>
      </div>
      <div v-if="labelList.length" class="flex">
        <div v-for="(item,index) in labelList" :key="index" class="label-item">
          <span class="mr-2">{{ item }}</span>
          <Icon icon="guanbi1" class="h-4 w-4" @click="delLabel(index)"></Icon>
        </div>
      </div>
    </div>
  </a-drawer>
  <!-- 分享成功的模态框和发布抽屉 -->
  <ShareModal :shareModal="shareModal" :shareName="shareName" @closeShare="closeShare"></ShareModal>
</template>

<script>
import { mapActions, mapWritableState } from "pinia";
import { deskStore } from "../../store/desk";
import { message } from 'ant-design-vue';
import ShareModal from "../ShareModal.vue";
import { cardStore } from "../../store/card";
import {nanoid} from 'nanoid'
import RadioTab from "../RadioTab.vue"
export default {
  name: "ShareDesk",
  components: {
    ShareModal,
    RadioTab
  },
  data() {
    return {
      showDrawer: false,
      desk: '',
      deskType: [],
      assort: '',
      assortList: [],
      labelVal: '',
      labelList: [],
      scheme: {},
      shareModal: false,
      shareName: '',
      blurb: '',
      cards: [],
      secretSwitch: true,
      dataType: [
        {title: '保留数据', icon: 'yk_yuanquan_fill', name: 'data'},
        {title: '不保留数据', icon: 'yk_yuanquan', name: 'notData'}
      ],
      defaultType: {title: '不保留数据', icon: 'yuanquan', name: 'notData'},
    }
  },
  props: {
    openDrawer: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    // ...mapWritableState(deskStore,['deskList','deskSize']),
    ...mapWritableState(deskStore,['deskList']),
    ...mapWritableState(cardStore, ['desks','settings','deskSize','countdownDay']),
  },
  watch: {
    openDrawer(newV){
      this.showDrawer = newV
      if(this.showDrawer){
        this.assortList = this.deskList.map(item => item.cname)
        this.assortList.unshift('请选择')
        this.assort = this.assortList[0]
        
        this.deskType = this.desks.map(item => item.name)
        this.desk = this.deskType[0]
        this.cards = this.desks[0]
        this.shareName = this.desk
        this.secretSwitch = true
      }
    },
  },
  methods: {
    ...mapActions(deskStore, ["setDeskList"]),
    close(){
      this.$emit('closeShare',false)
      this.setInitialData()
    },
    addLabel(){
      if(this.labelList.length >= 4)return message.info('最多添加四个')
      if(this.labelVal.trim()){
        this.labelList.push(this.labelVal)
        this.labelVal = ''
      }
    },
    delLabel(index){
      this.labelList.splice(index,1)
    },
    addPlan(){
      if (this.shareName.trim() === "")return message.info("请输入新桌面名称")
      if (this.shareName.length >= 16)return message.error("新桌面名称长度不可超过16")
      if(this.assort === '请选择') return message.info('请选择分类')
      // let test = []
      // test = this.cards.map((item,index) => {
      //   if(item.customData)item.customData = {}
      //   return item
      //   // if(item.customData)
      // })
      let cards = JSON.parse(JSON.stringify(this.cards))
      cards.cards.forEach((item,index) => {
        switch (item.name) {
          case 'notes':
            if(item.customData){
              item.customData.text = ''
            }
            break;
          case 'countdownDay':
            item.customData.notRetain = true
            break;
        }
      })
      
      const time = new Date().valueOf()
      let settings = {}
      if(cards.settings && cards.settings.enableZoom){
        settings = cards.settings
      }else{
        settings = this.settings
      }
      
      this.scheme = {
        id: nanoid(), 
        deskImg: '/img/test/deckImg.jpg',
        desk: this.desk,
        assort: this.assortList[this.assort],
        title: this.shareName,
        avatar: '/icons/logo128.png',
        nickName: 'Cordelia Butler',
        sumLikes: 0,
        download: 0,
        time,
        deskWidth: this.deskSize.deskWidth,
        deskHeight: this.deskSize.deskHeight,
        cardsHeight: this.deskSize.cardsHeight,
        blurb: this.blurb,
        labelList: this.labelList,
        cards: this.defaultType.name === 'notData' ? cards.cards : this.cards.cards,
        settings,
        cardList: []
      }
      this.setDeskList(this.scheme)
      this.close()
      this.shareModal = true
      this.setInitialData()
    },
    setInitialData(){
      this.desk = this.deskType[0]
      this.shareName = this.desk
      this.assort = this.assortList[0]
      this.blurb = ''
      this.labelList = []
      this.secretSwitch = true
      this.defaultType = {title: '不保留数据', icon: 'yuanquan', name: 'notData'}
    },
    closeShare(val){
      this.shareModal = val
    },
    setSelectVal(index){
      this.desks.map((item,i) => {
        if(index === i){
          this.cards = item
          this.shareName = item.name
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>
  .title{
    font-size: 16px;
    color: var(--primary-text);
    font-weight: 500;
  }
  .input{
    width: 452px;
    height: 48px;
    background: var(--secondary-bg);
    border-radius: 12px;
    color: var(--primary-text);
    font-size: 16px;
    border: 1px solid rgba(255,255,255,0.2);
    margin: 21px 0 24px;
  }
  .add-scheme{
    background: var(--active-bg);
    border-radius: 12px;
    width: 128px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--primary-text);
    font-size: 16px;
    cursor: pointer;
  }
  .add-label{
    width: 100px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--primary-text);
    background: var(--secondary-bg);
    margin-left: 12px;
    font-size: 16px;
  }
  .label-item{
    background: rgba(255,255,255,0.20);
    border-radius: 4px;
    height: 32px;
    color: var(--secondary-text);
    padding: 0 8px;
    display: flex;
    align-items: center;
    margin-right: 12px;
  }
</style>
