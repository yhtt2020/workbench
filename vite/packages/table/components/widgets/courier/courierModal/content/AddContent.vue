<template>
  <div class="flex flex-col" style="width:500px;height: 500px;">
    <div class="flex items-center justify-center w-full py-5" style="position: relative;">
      <span class="xt-text xt-font font-16 font-400">添加快递</span>
      <div class="flex items-center justify-center p-2 close-button pointer category-button rounded-xl xt-bg-2"
        @click="close">
        <CourierIcon icon="fluent:dismiss-16-filled" style="font-size: 1.25rem;color:var(--secondary-text);" />
      </div>
    </div>

    <div class="flex-col px-6" style="height: calc(100% - 131px);">
      <div class="px-4 py-3 mb-4 font-normal rounded-lg font-14 xt-text-2 xt-bg-2">「顺丰快递」和「菜鸟橙运」需要填写额外信息。</div>
      <vue-custom-scrollbar :settings="settingsScroller" class="h-full" style="height: 79%;">
        <div class="flex items-center mb-4" v-for="(item, index) in courierLists">

          <a-input ref="numRef" spellcheck="false" style="width: 280px; margin-right: 12px; border-radius: 8px;"
            v-model:value="item.orderNum" class="h-10 xt-bg-2"
            :style="item.code === 'SF' ? { width: '148px !important' } : { width: '280px !important' }" placeholder="输入快递单号"
            @input="getCourierNumber(item.orderNum, index)" allowClear />

          <a-input v-model:value="item.phoneLastNum" v-if="item.code === 'SF' || item.code === 'CNCY'"
            style="width: 120px; border-radius: 8px;margin-right: 12px;" class="h-10 xt-bg-2" placeholder="手机尾号后4位" />

          <a-select show-search class="custom-select" v-model:value="item.code" placeholder="自动识别"
            style="width: 120px;text-align: center;" ref="selectRef" :options="optionList" @input="searchCourier">
          </a-select>

          <div class="flex items-center ml-3 pointer category-button" @click="removeCourierInput(index)">
            <CourierIcon icon="akar-icons:trash-can" style="font-size: 1.2rem;color:var(--secondary-text);" />
          </div>
        </div>

        <div class="flex items-center justify-center w-full">
          <xt-button w="82" h="40" @click="createCourierInput">
            <div class="flex items-center justify-center">
              <CourierIcon icon="fluent:add-16-filled" style="font-size: 1.25rem;" />
              <span>添加</span>
            </div>
          </xt-button>
        </div>
      </vue-custom-scrollbar>

    </div>

    <div class="flex justify-end my-4 mr-4">
      <xt-button w="64" h="40" @click="close">取消</xt-button>
      <xt-button w="64" h="40" class="ml-3" type="theme" @click="addCourierData">确定</xt-button>
    </div>

  </div>
</template>

<script>
import { defineComponent, ref, reactive, toRefs, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { courierModalStore } from '../courierModalStore'
import { appStore } from '../../../../../store'
import { courierStore } from '../../../../../store/courier'
import { commonExpress, expressList } from '../modalMock'
import { getCourierName } from '../utils/courierUtils'
import { message } from 'ant-design-vue'
import { Icon as CourierIcon } from '@iconify/vue'


export default defineComponent({
  components: {
    CourierIcon
  },

  setup(props, ctx) {
    const courier = courierModalStore()
    const addCourier = courierStore()
    const useAppStore = appStore()
    const { courierLists } = storeToRefs(courier)

    const data = reactive({
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      phoneLastNum: '',
    })

    const numRef = ref(null)
    const selectRef = ref(null)

    const optionList = computed(() => {
      const list = expressList.map((item) => { return { value: item.code, label: item.name } })
      return list
    })

    const isOrderNumEmpty = computed(() => {
      return courierLists.value.some((item) => { return item.orderNum === '' });
    })

    // 关闭
    const close = () => { ctx.emit('close') }

    // 创建快递输入框
    const createCourierInput = () => {
      courier.addNewCourierInfo()
    }

    // 删除快递输入框
    const removeCourierInput = (index) => {
      if (index === 0) {
        numRef.value[0].stateValue = ''
        selectRef.value[0] = ''
      } else {
        courier.removeNewCourierInfo(index)
      }
    }

    // 输入框数据自动识别
    const getCourierNumber = (item, index) => {
      // console.log(useAppStore.settings.courierMatch)
      if (useAppStore.settings.courierMatch === 'preciseMatch') {
        if (item !== '') {
          const result = getCourierName(item)
          courier.updateNewCourierInfo({ code: result.code, label: result.name, orderNum: item, phoneLastNum: '' }, index)
        } else {
          courier.updateNewCourierInfo({ code: '自动识别', label: '自动识别', orderNum: '', phoneLastNum: '' }, index)
        }
      }else if(useAppStore.settings.courierMatch==='close'){
        // courier.updateNewCourierInfo({ code: '自动识别', label: '自动识别', orderNum: '', phoneLastNum: '' }, index)
      }

    }

    // 下拉框搜索
    const searchCourier = (evt) => {
      console.log('查看搜索结果', evt);

      // if(evt.data){
      //   const regexText = new RegExp(evt.data,"i");
      //   const find = expressList.find((item)=>{ 
      //    return regexText.test(item.name);
      //   })

      //   const result = expressList.filter((item)=>{
      //    return regexText.test(item.name);
      //   })
      //   const filterResult = result.map((item)=>{ return {value:item.code,label:item.name} })

      //   console.log('查看find结果',{value:find.code,label:find.name});

      //   courierValue.value = { value:find.code,label:find.name }
      //   filterOption.value = filterResult

      // }else{
      //   courierValue.value = ''
      // }
    }

    // 最终添加按钮
    const addCourierData = (evt) => {
      if (courierLists.value.length === 1) {
        if (courierLists.value[0].orderNum === '') {
          message.warning('请添加快递信息')
          evt.preventDefault();
        } else {
          addCourier.putCourierInfo(courierLists.value[0].code, courierLists.value[0].orderNum, courierLists.value[0].phoneLastNum)
          ctx.emit('close')
        }
      } else {
        if (isOrderNumEmpty.value) {
          message.warning('请添加快递信息')
          evt.preventDefault();
        } else {

          for (let i = 0; i < courierLists.value.length; i++) {
            console.log(numRef.value[i].stateValue);
            addCourier.putCourierInfo(courierLists.value[i].code, courierLists.value[i].orderNum, courierLists.value[i].phoneLastNum)
          }
          ctx.emit('close')
        }
      }
    }





    return {
      courierLists, optionList, isOrderNumEmpty, numRef, selectRef,
      ...toRefs(data), close, createCourierInput, removeCourierInput,
      getCourierNumber, searchCourier, addCourierData,
    }
  }
})
</script>

<style lang="scss" scoped>
.close-button {
  position: absolute;
  top: 16px;
  right: 16px;
}

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
</style>