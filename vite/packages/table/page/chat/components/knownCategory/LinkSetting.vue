<template>
  <teleport to="body">
    <Modal v-if="linkVisible" v-model:visible="linkVisible" :blurFlag="true">
      <div class="flex flex-col my-3" style="width:500px;">
        <ModalTop title="自定义网页链接"  @close="linkVisible = false" />
        <div class="flex flex-col px-6">
          <div class="p-4 flex rounded-lg flex-col mb-4 xt-bg-2">
            <span class="font-16 font-400 xt-font  xt-text mb-2.5">操作指南</span>
            <span class="font-14 font-400 xt-font xt-text-2">
             输入带有“https://”或“http://”前缀的，完整的网页地址。支持选择点击链接后的打开方式，默认使用工作台设置。
            </span>
          </div>
          <a-input class="h-10" v-model:value="linkName" ref="linkNameRef" style="border-radius: 12px; margin-bottom: 12px;" placeholder="链接名称" />
          <a-input-group compact>
            <a-select v-model:value="requestProtocol" style="width:20%;">
              <a-select-option value="https">https</a-select-option>
              <a-select-option value="http">http</a-select-option>
            </a-select>
            <a-input v-model:value="link" ref="linkRef" placeholder="请输入" spellcheck="false" style="width: 80%;height:40px !important;border-top-right-radius: 8px !important;border-bottom-right-radius:8px;" />
          </a-input-group>
          <span class="font-16 font-400 my-4 xt-font xt-text">链接打开方式</span>
          <RadioTab :navList="openType" class="my-3" v-model:selectType="defaultOpen"></RadioTab>
          <template v-if="defaultOpen.openMethod === 'outerOpen'">
           <RadioTab  :navList="linkType" v-model:selectType="defaultType"></RadioTab>
          </template>
          <div class="flex items-center justify-end my-3">
            <xt-button w="64" h="40" class="category-button mr-3" @click="linkVisible = false">取消</xt-button>
            <xt-button w="64" h="40" class="category-button" type="theme" @click="submitSelect">确定</xt-button>
          </div>
        </div>
      </div>
    </Modal>
  </teleport>
</template>

<script>
import { mapActions } from 'pinia'
import { Icon as LinkIcon } from '@iconify/vue'
import { communityStore } from '../../store/communityStore'
import { message } from 'ant-design-vue'

import Modal from '../../../../components/Modal.vue';
import RadioTab from '../../../../components/RadioTab.vue';
import ModalTop from '../ModalTop.vue';

export default {
  components:{
    Modal,ModalTop,RadioTab
  },

  props:['no','id','item'],

  data(){
    return{
      linkVisible:false,
      defaultType:{ title:'内部浏览器',name:'inter',openMethod:'userSelect' },
      defaultOpen:{title:'当前页面直接打开',name:'current',openMethod:'currentPage'},
      linkType:[
       { title:'内部浏览器',name:'inter',openMethod:'userSelect' },
       { title:'系统浏览器',name:'system',openMethod:'systemSelect'}
      ],
      openType:[
       {title:'当前页面直接打开',name:'current',openMethod:'currentPage'},
       {title:'外部跳转打开',name:'outer',openMethod:'outerOpen'},
      ],
      link:'',
      linkName:'',
      requestProtocol:'https',
    }
  },

  mounted(){
    this.$nextTick(()=>{
      if(this.item !== undefined){
        const data = JSON.parse(this.item?.props)
        const url = data.url
        if(data !== undefined && url !== undefined){
          const isHttp = url.indexOf("http://") !== -1
          const isHttps = url.indexOf("https://") !== -1
          if(isHttp){
           this.link = data.url.slice(7)
          }else if(isHttps){
           this.link = data.url.slice(8) 
          }  
          this.linkName = this.item.name
        }else{
          return 
        }
      }
    })
  },

  methods:{
    ...mapActions(communityStore,['updateChannel']),
    openLinkModal(){
      this.linkVisible = true
      this.$nextTick(()=>{
        const nameRef = this.$refs.linkNameRef
        const linkRef = this.$refs.linkRef
        nameRef.select()
        linkRef.select()
      })
    },
    // 更新
    submitSelect(evt){
      const openWay = this.defaultOpen.openMethod === 'currentPage';
      const propsData  = JSON.stringify({
        url:`${this.requestProtocol}://${this.link}`,
        openMethod: openWay ? this.defaultOpen.openMethod : this.defaultType.openMethod
      })
      const option = {
       ...this.item,
       name:this.linkName,
       props:propsData
      }
      this.updateChannel(option)
      message.success('链接设置成功')
      this.linkVisible = false
    }
  },

  watch:{
    defaultType(newVal){  this.defaultType = newVal },
    defaultOpen(newVal){ this.defaultOpen = newVal },
    'item':{
      handler(newVal){
        const emptyItem = newVal !== undefined
        if(emptyItem){
          const data = JSON.parse(newVal.props)
          if(data.openMethod === 'currentPage'){
            this.defaultType = {title:'当前页面直接打开',name:'current',openMethod:'currentPage'}
          }else{
            this.defaultOpen = {title:'外部跳转打开',name:'outer',openMethod:'outerOpen'}
            if(data.openMethod === 'userSelect'){
             this.defaultType = { title:'内部浏览器',name:'inter',openMethod:'userSelect' }
            }else{
             this.defaultType = { title:'系统浏览器',name:'system',openMethod:'systemSelect'}
            }
          }
        }
      },
      immediate:true,
      deep:true
    }
  }
};
</script>

<style lang="scss" scoped>
:deep(.ant-input) {
  color: var(--secondary-text) !important;
  font-size: 1.15em;
  &::placeholder {
    color: var(--secondary-text) !important;
  }
}
:deep(.ant-select .ant-select-selector) {
  height: 40px !important;
  border-top-left-radius: 8px !important;
  border-bottom-left-radius: 8px !important;
}
:deep(.ant-select-selection-item) {
  line-height: 40px !important;
}
</style>