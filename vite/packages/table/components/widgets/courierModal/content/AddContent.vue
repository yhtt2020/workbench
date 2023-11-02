<template>
  <div class="flex flex-col" style="width:500px;height: 500px;">
   <div class="w-full flex items-center justify-center py-5" style="position: relative;">
    <span class="xt-text xt-font font-16 font-400">添加快递</span>
    <div class="flex close-button pointer items-center justify-center p-2 category-button rounded-xl xt-bg-2" @click="close">
     <CourierIcon icon="fluent:dismiss-16-filled"  style="font-size: 1.25rem;color:var(--secondary-text);"/>
    </div>
   </div>
 
   <div class="px-6 flex-col" style="height: calc(100% - 131px);">
    <div class="font-14 font-normal xt-text-2 px-4 py-3 xt-bg-2 mb-4 rounded-lg">「顺丰快递」和「菜鸟橙运」需要填写额外信息。</div>
    <vue-custom-scrollbar :settings="settingsScroller" class="h-full" style="height: 79%;">
      <div class="flex items-center mb-4" v-for="(item,index) in courierLists">
        <!--  :filter-option="filterOption" -->
       <a-select  show-search placeholder="自动识别"  v-model:value="item.code"
        style="width: 120px" :options="optionList"  @input="searchCourier"
       >
       </a-select>

       <a-input spellcheck="false" style="width: 280px; margin: 0 12px; border-radius: 8px;" 
        v-model:value="item.orderNum" class="h-10 xt-bg-2"  :style="item.code === 'SF' ? { width: '148px !important'} : { width:'280px !important' }"
        placeholder="输入快递单号" @input="getCourierNumber(item.orderNum,index)"
       />
      
       <a-input v-if="item.code === 'SF'" style="width: 120px; border-radius: 8px;margin-right: 12px;" class="h-10 xt-bg-2" placeholder="手机尾号后4位"/>
      
       <div class="flex items-center  pointer category-button" @click="removeCourierInput(index)">
        <CourierIcon icon="akar-icons:trash-can" style="font-size: 1.2rem;color:var(--secondary-text);" />
       </div>
      </div>

      <div class="flex items-center justify-center  w-full">
       <xt-button w="82" h="40" @click="createCourierInput">
        <div class="flex items-center justify-center">
          <CourierIcon icon="fluent:add-16-filled" style="font-size: 1.25rem;"/>
          <span>添加</span>
        </div>
       </xt-button>
      </div>
    </vue-custom-scrollbar>
    
   </div>
 
   <div class="flex my-4 mr-4 justify-end">
     <xt-button w="64" h="40" @click="close">取消</xt-button>
     <xt-button w="64" h="40" class="ml-3" type="theme" @click="addCourierData">确定</xt-button>
   </div>

  </div>
 </template>

<script>
import { defineComponent,ref,reactive,toRefs,computed} from 'vue'
import { storeToRefs } from 'pinia'
import { courierModalStore } from '../courierModalStore'
import { courierStore } from '../../../../store/courier'
import { commonExpress,expressList } from '../modalMock'
import { getCourierName } from '../utils/courierUtils'
import { message }  from 'ant-design-vue'
import { Icon as CourierIcon } from '@iconify/vue'


export default defineComponent({
  components:{
    CourierIcon
  },

  setup (props,ctx) {
    const courier  = courierModalStore()
    const addCourier = courierStore()
    const { courierLists } = storeToRefs(courier)

    const data = reactive({
      settingsScroller: { 
       useBothWheelAxes: true,
       swipeEasing: true,
       suppressScrollY: false,
       suppressScrollX: true,
       wheelPropagation: true
      },
    })

    const optionList = computed(()=>{
      const list = expressList.map((item)=>{ return {value:item.code,label:item.name} })
      return list
    })
    
    const isOrderNumEmpty = computed(()=>{
     return courierLists.value.some((item) => { return item.orderNum === ''});
    }) 

    // 关闭
    const close = ()=>{ ctx.emit('close') }

    // 创建快递输入框
    const createCourierInput = () => {
      courier.addNewCourierInfo()
    }

    // 删除快递输入框
    const removeCourierInput = (index) =>{
      // console.log('查看index',index);
      courier.removeNewCourierInfo(index)
    }

    // 输入框数据自动识别
    const getCourierNumber = (item,index) =>{
      // console.log('查看item',item,index);
      if(item !== ''){
        const result =  getCourierName(item)
        // console.log('查看返回情况',{code:result.code,label:result.name,orderNum:item});
        // console.log('查看index',index);
        courier.updateNewCourierInfo({code:result.code,label:result.name,orderNum:item},index)
      }else{
        courier.updateNewCourierInfo({code:'自动识别',label:'自动识别',orderNum:''},index)
      }
    }

    // 下拉框搜索
    const searchCourier = (evt) =>{
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
    const addCourierData = (evt) =>{
      console.log(courierLists.value.length);
      if(courierLists.value.length === 1){
        // console.log('查看是否为单个添加');
        // console.log('查看用户是否输入参数',courierLists.value[0].orderNum === '');
        if(courierLists.value[0].orderNum === ''){
          message.warning('请添加快递信息')
          evt.preventDefault();
        }else{
          console.log('参数容错',courierLists.value[0]);
          addCourier.putCourierInfo(courierLists.value[0].code,courierLists.value[0].orderNum,'')
          ctx.emit('close')
        }
      }else{
        // console.log('查看是否为多个添加');
        // console.log('查看用户是否输入参数',isOrderNumEmpty.value);
        if(isOrderNumEmpty.value){
          message.warning('请添加快递信息')
          evt.preventDefault();
        }else{
          for(let i=0;i<courierLists.value.length;i++){
            console.log('查看结果',courierLists.value[i]);
            addCourier.putCourierInfo(courierLists.value[i].code,courierLists.value[i].orderNum,'')
          }
          ctx.emit('close')
        }
      }
    }





    return {
      courierLists,optionList,isOrderNumEmpty,
      ...toRefs(data),close,createCourierInput,removeCourierInput,
      getCourierNumber,searchCourier,addCourierData,
    }
  }
})
</script>

<style lang="scss" scoped>
.close-button{
 position: absolute;
 top:16px;
 right: 16px;
}

:deep(.xt-active-btn){
 border-radius: 8px !important;
}

:deep(.ant-input){
 color: var(--secondary-text) !important;
 font-size: 14px;
 font-weight: 400;
 &::placeholder{
  color: var(--secondary-text) !important;
 }
}

:deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector){
  border-radius: 8px !important;
  height: 40px !important;
}

:deep(.ant-select-selector){
  line-height: 40px !important;
  & input{
    line-height: 40px !important;
  }
}
</style>