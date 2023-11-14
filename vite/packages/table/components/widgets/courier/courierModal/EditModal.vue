<template>
  <teleport to='body'>
    <Modal v-model:visible="editVisible" v-if="editVisible" :blurFlag="true" style="z-index: 750;">
      <div class="flex flex-col" style="width: 500px;height: 250px;">
        <div class="flex items-center justify-center w-full h-16 py-4 px-4" style="position: relative;">
          <span class="xt-text xt-font font-16 font-400">编辑订单</span>
          <div class="right-close">
            <xt-button w="32" h="32" class="category-button" style="border-radius: 8px;" @click="editVisible = false">
              <div class="flex items-center justify-center">
                <EditIcon icon="fluent:dismiss-16-filled" style="font-size: 1.25rem;"/>
              </div>
            </xt-button>
          </div>
        </div>

        <div class="mb-4 px-6 flex flex-col">
          <div class="flex items-center mb-4">
            <div class="flex items-center mr-3 justify-center rounded-lg w-14 h-14 pointer category-button xt-bg-2"
                 @click="onUpdateImg">
              <a-avatar :size="32" :src="editAvatar"></a-avatar>
            </div>
            <GoodIcon v-show="goodIconVisible" :goodVisible="false" :windowHeight="innerHeight" @getAvatar="getAvatar"/>
            <a-input @keydown.enter="submitEdit" ref="titleRef" class="xt-bg-2 h-10" v-model:value="form.title" style="width:383px;border-radius: 8px;"></a-input>
          </div>
          <div class="flex " v-if="!order.store">
            <a-input ref="codeRef" class="xt-bg-2" v-model:value="form.logisticCode" placeholder="快递单号"
                     style="width: 188px;border-radius: 8px;margin-right: 12px "></a-input>
            <a-input v-if="form.shipperCode==='SF' || form.shipperCode==='CNCY'" class="xt-bg-2" v-model:value="form.customerName" placeholder="手机尾号"
                     style="width:120px;border-radius: 8px;margin-right: 12px"></a-input>
            <a-select class="custom-select xt-text-2" v-model:value="form.shipperCode" placeholder="自动识别"
                      style="width:120px;border-radius: 8px;">
              <a-select-option v-for="item in optionList" :value="item.code" class="xt-text-2">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </div>
          <div v-else class="text-center xt-text-2">
            商城订单不支持修改订单快递单号
          </div>
        </div>


        <div class="px-4 flex justify-end">
          <xt-button w="64" h="40" class="mr-3" style="border-radius: 8px;" @click="editVisible = false">取消
          </xt-button>
          <xt-button w="64" h="40" style="border-radius: 8px;" type="theme" @click="submitEdit">确定</xt-button>
        </div>
      </div>

    </Modal>
  </teleport>
</template>

<script>
import { Icon as EditIcon } from '@iconify/vue'
import { expressList } from './modalMock'
import { getCourierName } from './utils/courierUtils'
import {mapActions} from 'pinia'
import Modal from '../../../Modal.vue'
import GoodIcon from '../../../../../selectIcon/page/index.vue'
import { courierStore } from '../../../../apps/ecommerce/courier'
import { message } from 'ant-design-vue'
import { generateTitle } from '../courierTool'

export default {
  components: {
    Modal, EditIcon, GoodIcon
  },

  props: ['avatar', 'order'],

  data () {
    return {
      editVisible: false,
      editName: 'IKEA宜家沙发',
      editNum: 'SF00003618100',
      editPhone: '9150',
      optionList: expressList,
      editValue: '',
      goodIconVisible: false,
      innerHeight: 100,
      editAvatar: this.avatar,

      form: {
        title: '',
        cover: '',
        logisticCode:'',
        customerName:'',
        shipperCode:''

      }
    }
  },

  mounted () {

  },

  methods: {
    ...mapActions(courierStore,['updateDbItem']),
    openEditModal () {
      this.editVisible = true
      this.form={
        title:this.order.title,
        cover:this.order.cover,
      }
      if(!this.order.store){
        this.form.logisticCode=this.order.logisticCode
        this.form.customerName=this.order.customerName
        if(getCourierName(this.order.logisticCode)){
          console.log(getCourierName(this.order.logisticCode),'shiopre')
          this.form.shipperCode = getCourierName(this.order.logisticCode).code
        }

      }
      this.$nextTick(()=>{
        this.$refs.titleRef.focus()
        this.$refs.titleRef.select()
      })
    },

    onUpdateImg () {
      this.goodIconVisible = !this.goodIconVisible
    },

    // 获取头像
    getAvatar (avatar) {
      if (avatar.indexOf('color=') >= 0) {
        let color = avatar.substr(avatar.indexOf('color=') + 7, 6)
        this.bgColor = color
      } else {
        this.bgColor = ''
      }
      this.editAvatar = avatar
    },

   async  submitEdit () {
      // todo  编辑后的操作
      if(this.form.title.trim()===''){
        message.error('请输入订单名称')
      }
      let data={
        _id:this.order._id,
        title: this.form.title.trim(),
        edited:true,//标记已编辑
      }
      if(!this.order.store){
        //普快
        data.logisticCode=this.form.logisticCode
        data.customerName=this.form.customerName
        data.shipperCode=this.form.shipperCode
      }
      let rs=await this.updateDbItem(data)
      if(rs){
        message.success('编辑成功')
        this.order.title=this.form.title
        this.order.logisticCode=this.form.logisticCode
        this.order.customerName=this.form.customerName
        this.order.shipperCode=this.form.shipperCode
        this.editVisible=false
      }else{
        message.error('保存失败')
      }

    }

  },
  watch:{
    'form.title':{
      handler(newVal){
        if(newVal===''){
          this.form.title=generateTitle(this.order.content,this.order.store)
          this.$nextTick(()=>{
            this.$refs.titleRef.focus()
            this.$refs.titleRef.select()
          })
        }
      }
    },
    'form.logisticCode':{
      handler(newVal){
        if(newVal===''){
          this.form.logisticCode=this.order.content.LogisticCode
          this.$nextTick(()=>{
            this.$refs.codeRef.focus()
            this.$refs.codeRef.select()
          })
        }
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.right-close {
  position: absolute;
  top: 16px;
  right: 16px;
}

:deep(.custom-select) {
  & .ant-select-selector {
    border-radius: 8px !important;
    display: flex;
    align-items: center;
    height: 40px !important;
  }
}


:deep(.ant-select-single .ant-select-selector .ant-select-selection-item, .ant-select-single .ant-select-selector .ant-select-selection-placeholder) {
  color: var(--secondary-text) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}


:deep(.ant-select-selection-search) {
  display: flex !important;
  align-items: center !important;
  height: 40px !important;
}


:deep(.anticon.ant-input-clear-icon) {
  color: var(--secondary-text) !important;
}

:deep(.ant-input) {
  color: var(--secondary-text) !important;
  font-size: 14px;
  font-weight: 400;

  &::placeholder {
    color: var(--secondary-text) !important;
  }
}

:deep(.float-icon) {
  top: 125px !important;
}
</style>
