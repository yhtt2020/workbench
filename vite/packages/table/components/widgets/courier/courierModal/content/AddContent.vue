<template>
  <div class="flex flex-col pt-2" style="width:500px;height: 500px;">
    <ModalTop title="添加快递" @close="close" :classTop="'mb-4'" />
    <div class="flex-col grow px-6" style="height: calc(100% - 131px);">
      <div class="px-4 py-3 mb-4 font-normal rounded-lg font-14 xt-text-2 xt-bg-2">
        「顺丰快递」和「菜鸟橙运」需要填写额外信息。
      </div>
      <div class=" flex flex-col" style="height: 70%;">
        <XtScrollbar  :y="true" style="height: 100%;width: 100%;">
          <template v-for="(item,index) in courierLists">
            <div class="flex items-center mb-4">
              <a-input ref="numRef" spellcheck="false" style="width: 280px; margin-right: 12px; border-radius: 8px;"
               v-model:value="item.orderNum" class="h-10 xt-bg-2"  placeholder="输入快递单号"
               :style="item.code === 'SF' ? { width: '148px !important' } : { width: '280px !important' }"
               @input="getCourierNumber(item.orderNum, index)" allowClear
              />

              <a-input v-model:value="item.phoneLastNum" v-if="item.code === 'SF' || item.code === 'CNCY'"
               style="width: 120px; border-radius: 8px;margin-right: 12px;" class="h-10 xt-bg-2"
               placeholder="手机尾号后4位"
              />

              <a-select show-search class="custom-select" v-model:value="item.code" placeholder="自动识别"
                style="width: 120px;text-align: center;margin-right: 12px;" ref="selectRef" :options="optionList"
                @search="searchCourier($event)"
              >
              </a-select>

              <xt-button w="40" h="40" style="border-radius: 8px;" @click="removeCourierInput(index)">
                <div class="flex items-center justify-center">
                  <xt-new-icon icon="akar-icons:trash-can" size="20"></xt-new-icon>
                </div>
              </xt-button>
            </div>
          </template>
          <div class="flex items-center justify-center">
            <xt-button w="82" h="40" @click="createCourierInput($event)">
              <div class="flex items-center justify-center">
                <xt-new-icon icon="fluent:add-16-filled" size="20"></xt-new-icon>
                <span>添加</span>
              </div>
            </xt-button>
          </div>
        </XtScrollbar>
      </div>
    </div>
    <div class="flex justify-end my-4 pr-4">
      <xt-button w="64" h="40" @click="close">取消</xt-button>
      <xt-button w="64" h="40" class="ml-3" type="theme" @click="addCourierData($event)">确定</xt-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed,} from 'vue';
import {storeToRefs} from 'pinia';
import { courierModalStore } from '../courierModalStore';
import { appStore } from '../../../../../store';
import { courierStore } from '../../../../../apps/ecommerce/courier';
import { commonExpress, expressList } from '../modalMock';
import { getCourierName } from '../utils/courierUtils';
import { message } from 'ant-design-vue';

import ModalTop from '../../component/ModalTop.vue';

const emits = defineEmits(['close']);

const courier = courierModalStore();
const addCourier = courierStore()
const useAppStore = appStore()
const { courierLists } = storeToRefs(courier)

const phoneLastNum = ref('');
const numRef = ref(null)
const selectRef = ref(null)

// 计算属性
const optionList = computed(() => {
  const list = expressList.map((item) => { return { value: item.code, label: item.name } })
  return list
})
const isOrderNumEmpty = computed(() => {
  return courierLists.value.some((item) => { return item.orderNum === '' })
})

// 重置清空操作
function clear(){
  courierLists.value=[{code:'自动识别',label:'自动识别', orderNum:'',phoneLastNum:''}]
}

// 关闭
const close = () => {
  emits('close')
}

// 创建快递输入框
const createCourierInput = (evt) => {
  if(courierLists.value[0].orderNum) return courier.addNewCourierInfo();
  message.error('输入框不能为空,请输入需要的快递单号');
  evt.preventDefault();
}

// 删除快递输入框
const removeCourierInput = (index) =>{
  if (index === 0) return clear();
  courier.removeNewCourierInfo(index);
}

// 输入框自动识别
const getCourierNumber = (item, index) =>{
  if (item !== '') {
    const result = getCourierName(item)
    console.log('result',result);
    courier.updateNewCourierInfo({ code: result.code, label: result.name, orderNum: item, phoneLastNum: '' }, index)
  }
  else {
    courier.updateNewCourierInfo({ code: '自动识别', label: '自动识别', orderNum: '', phoneLastNum: '' }, index)
  }
}

// 下拉菜单搜索
const searchCourier = (evt) =>{
  console.log('查看搜索结果', evt)
  // const find = optionList.value.find((item)=>{ return String(item.label) === String(evt) });

  // if(courierLists.value.length === 1){
  //   if(courierLists.value.orderNum){
  //     courierLists.value[0].code = find.value;
  //   }
  // }
  // else{

  // }
  // console.log('find',find.value,courierLists.value[0]);
  // console.log('find',find,courierLists.value[0]);

}

// 快递添加完成
const addCourierData = async (evt) =>{
  if(courierLists.value.length === 1){
    if(courierLists.value[0].orderNum){
      const addCode = courierLists.value[0].code;
      const addNum = courierLists.value[0].orderNum;
      const addPhone = courierLists.value[0].phoneLastNum;
      const result = await addCourier.putCourierInfo(addCode,addNum,addPhone);
      if(result){
        message.success('添加快递成功。');
        clear();
        emits('close');
      } 
    }
    else {
      console.log(courierLists.value)
      message.warning('请填写快递单号');
      evt.preventDefault();
    }
  }
  else {
    if (isOrderNumEmpty.value){
      message.warning('请添加快递信息');
      evt.preventDefault();
    }
    else {
      for (const item of courierLists.value) {
        if (item) {
          addCourier.putCourierInfo(item.code, item.orderNum, item.phoneLastNum)
        }
      }
      message.success('添加快递成功。')
      clear()
      emits('close')
    }
  }
}

</script>

<style lang="scss" scoped>
:deep(.xt-active-btn) {
  border-radius: 8px !important;
}
:deep(.ant-input) {
  color: var(--secondary-text) !important;
  font-size: 14px;
  font-weight: 400;

  &::placeholder {
    color: var(--secondary-text) !important;
  }
}
:deep(.custom-select) {
  & .ant-select-selector {
    border-radius: 8px !important;
    display: flex;
    align-items: center;
    height: 40px !important;
  }
  & .ant-select-item {
    color: var(--secondary-text) !important;
  }
}
:deep(.ant-select-selection-placeholder) {
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
</style>
