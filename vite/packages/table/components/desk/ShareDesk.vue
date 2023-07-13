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
      <span class="title">标题</span>
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
export default {
  name: "ShareDesk",
  components: {
    ShareModal
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
    }
  },
  props: {
    openDrawer: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    ...mapWritableState(deskStore,['deskList','deskSize']),
    ...mapWritableState(cardStore, ['desks','settings']),
  },
  watch: {
    openDrawer(newV){
      this.showDrawer = newV
    },
  },
  methods: {
    ...mapActions(deskStore, ["setDeskList"]),
    close(){
      this.$emit('closeShare',false)
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
      const time = new Date().valueOf()
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
        cards: this.cards,
        settings: this.settings,
        cardList: []
      }
      this.setDeskList(this.scheme)
      this.close()
      this.shareModal = true
      this.desk = this.deskType[0]
      this.shareName = ''
      this.assort = this.assortList[0]
      this.blurb = ''
      this.labelList = []
    },
    closeShare(val){
      this.shareModal = val
    },
    setSelectVal(index){
      this.desks.map((item,i) => {
        if(index === i){
          this.cards = item.cards
        }
      })
    }
  },
  mounted() {
    this.assortList = this.deskList.map(item => item.cname)
    this.assortList.unshift('请选择')
    this.assort = this.assortList[0]
    
    this.deskType = this.desks.map(item => item.name)
    this.desk = this.deskType[0]
    this.cards = this.desks[0].cards
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
