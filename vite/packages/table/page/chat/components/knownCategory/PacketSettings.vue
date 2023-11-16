<template>
  <teleport to='body'>
    <Modal v-if="setVisible" :blurFlag="true" v-model:visible="setVisible" style="z-index: 200 !important;">
      <div class="flex flex-col my-3" style="width:500px;">
        <ModalTop  title="分组设置" @close="setVisible = false"/>
        <div class="flex flex-col px-6">
          <a-input placeholder="分组名称" v-model:value="categoryName" class="h-10 search" style="border-radius: 8px;text-align: center;" @pressEnter="submitCategory" />
          <div class="mt-4 flex items-center justify-end pt-4">
            <xt-button w="64" h="40" class="mr-3 category-button" @click="setVisible = false">取消</xt-button>
            <xt-button w="64" h="40" type="theme" class="category-button" @click="submitCategory">确定</xt-button>
          </div>
        </div>
      </div>
    </Modal>
  </teleport>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia'
import { communityStore } from '../../store/communityStore'
import { message } from 'ant-design-vue'

import Modal from '../../../../components/Modal.vue';
import ModalTop from '../ModalTop.vue';

export default {
  components:{
    Modal,ModalTop,
  },

  props: ["no","item"],

  data(){
    return{
      setVisible:false,
      // categoryName: this.item.name !== undefined ? this.item.name : '' ,
    }
  },

  methods:{
    ...mapActions(communityStore,['updateChannel']),
    openSetModal(){
      this.setVisible = true
      this.$nextTick(()=>{
       const inputDom = document.querySelector('.search')
       inputDom.focus()
       inputDom.select()
      })
    },
    // 完成更新
    submitCategory(evt){
      if(this.categoryName !== '' && this.no !== '1'){
        const option = {
          ...this.item,
          name:this.categoryName
        }
        console.log('查看option',option);
        this.updateChannel(option,this.no)
        message.success('数据更新成功')
        this.setVisible = false
      }else{
        message.error('数据不能为空')
        evt.preventDefault();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>