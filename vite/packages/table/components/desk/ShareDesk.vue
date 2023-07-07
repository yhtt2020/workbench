<template>
  <a-drawer v-model:visible="showDrawer" @close="close" style="z-index:9999;" width="500" placement="right">
     <template #extra>
      <a-space>
        <div class="add-scheme" @click="addPlan()">立即分享</div>
      </a-space>
    </template>
    <div>
      <span class="title">桌面</span>
      <a-select v-model:value="desk" style="height:48px; border:none;" 
      :bordered="false" size="large" class="input rounded-lg  text-xs flex items-center" 
      :dropdownStyle="{ 'z-index': 9999, backgroundColor: 'var(--secondary-bg)' }">
        <template #suffixIcon>
          <Icon icon="xiangyou" class="h-4 w-4" @click="delLabel(index)"></Icon>
        </template>
        <a-select-option v-for="i in deskType" :key="i" :value="i.value">{{ i.name }}</a-select-option>
      </a-select>
      <span class="title">标题</span>
      <a-input v-model:value="shoreName" spellcheck ="false" class="input" placeholder="请输入" aria-placeholder="font-size: 16px;"/>
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
  <ShareModal :shoreModal="shoreModal" :shoreName="shoreName" @closeShore="closeShore"></ShareModal>
</template>

<script>
import { mapActions, mapWritableState } from "pinia";
import { deskStore } from "../../store/desk";
import { message } from 'ant-design-vue';
import ShareModal from "../ShareModal.vue";
import {nanoid} from 'nanoid'
export default {
  name: "ShareDesk",
  components: {
    ShareModal
  },
  data() {
    return {
      showDrawer: false,
      desk: '桌面1',
      deskType: [
        { name: '桌面1', value: '桌面1' },
        { name: '桌面2', value: '桌面2' },
        { name: '桌面3', value: '桌面3' },
        { name: '桌面4', value: '桌面4' },
      ],
      assort: '',
      assortList: [],
      labelVal: '',
      labelList: [],
      scheme: {},
      shoreModal: false,
      shoreName: '',
      blurb: '',
    }
  },
  props: {
    openDrawer: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    ...mapWritableState(deskStore,['deskList'])
  },
  watch: {
    openDrawer(newV){
      this.showDrawer = newV
    },
  },
  methods: {
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
        deskImg: '',
        desk: this.desk,
        assort: this.assortList[this.assort],
        title: this.shoreName,
        avatar: '/icons/logo128.png',
        nickName: 'Cordelia Butler',
        sumLikes: 0,
        download: 0,
        time,
        size: '1920x1080',
        blurb: this.blurb,
        labelList: this.labelList,
        cardList: [],
      }
      this.close()
      this.shoreModal = true
      // console.log(this.scheme)
    },
    closeShore(val){
      this.shoreModal = val
    },
  },
  mounted() {
    this.assortList = this.deskList.map(item => item.cname)
    this.assortList.unshift('请选择')
    this.assort = this.assortList[0]
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
