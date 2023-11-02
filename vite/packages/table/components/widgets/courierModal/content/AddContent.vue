<template>
  <div class="flex flex-col" style="width:500px;height: 500px;">
   <div class="w-full flex items-center justify-center py-5" style="position: relative;">
    <span class="xt-text xt-font font-16 font-400">添加快递</span>
    <div class="flex close-button pointer items-center justify-center p-2 category-button rounded-xl xt-bg-2" @click="close">
     <CourierIcon icon="fluent:dismiss-16-filled"  style="font-size: 1.25rem;color:var(--secondary-text);"/>
    </div>
   </div>
 
   <div class="px-6 flex-col" style="height: calc(100% - 106px);">
     <div class="font-14 font-normal xt-text-2 px-4 py-3 xt-bg-2 mb-4 rounded-lg">「顺丰快递」和「菜鸟橙运」需要填写额外信息。</div>
     
     <template v-if="infoList.length === 0">
       <div class="flex items-center ">
         <a-select v-model:value="courierValue" show-search placeholder="自动识别"  style="width: 120px" :options="optionList"
          :filter-option="filterOption"  @input="searchCourier"
         >
         </a-select>
         
 
         <a-input spellcheck="false" style="width: 280px; margin: 0 12px; border-radius: 8px;" v-model:value="courierNum" class="h-10 xt-bg-2" placeholder="输入快递单号" @input="getCourierNumber"/>
         <!-- <a-input style="width: 120px; border-radius: 8px;" class="h-10 xt-bg-2" placeholder="手机尾号后4位"/> -->
 
        <div class="flex items-center w-8 h-8 pointer category-button" @click="removeCourier">
          <CourierIcon icon="akar-icons:trash-can" class="ml-3" style="font-size: 1.2rem;color:var(--secondary-text);" />
        </div>
       </div>

     </template>
     
     <!-- <div class="flex items-center my-4 justify-center">
       <xt-button @click="addInfo" h="40">
         <div class="flex items-center justify-center">
           <CourierIcon icon="fluent:add-16-filled" style="font-size: 1.25rem;"/>
           <span class="ml-2 xt-text font-16 font-400">添加</span>
         </div>
       </xt-button>
     </div> -->
   </div>
 
   <div class="flex mb-4 mr-4 justify-end">
     <xt-button w="64" h="40" @click="close">取消</xt-button>
     <xt-button w="64" h="40" class="ml-3" type="theme" @click="addCourierData">确定</xt-button>
   </div>

  </div>
 </template>

<script>
import { defineComponent,ref,reactive,toRefs,computed, onMounted } from 'vue'
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

    const { infoList } = storeToRefs(courier)
    
    const courierValue = ref({label:'自动识别',code:'auto'})
    const filterOption = ref([])
    
    const data = reactive({
      courierNum:'',
    })

    const optionList = computed(()=>{
      const list = expressList.map((item)=>{ return {value:item.code,label:item.name} })
      return list
    })

    // 关闭
    const close = ()=>{
      ctx.emit('close')
    }

    // 添加
    const addInfo = () =>{

    }

    // 最终确定按钮
    const addCourierData = async() =>{
      if(data.courierNum !== '' && courierValue.value.code !== 'auto'){

        // console.log('查看数据结构',data.courierNum,courierValue.value);

        addCourier.putCourierInfo(courierValue.value,data.courierNum,'')
        message.success('快递添加成功')
        ctx.emit('close')

      }else{
        message.warning('添加快递数据不能为空')
      }
    }

    // 搜索选择
    const searchCourier = (evt) =>{
      if(evt.data){
        const regexText = new RegExp(evt.data,"i");
        const find = expressList.find((item)=>{ 
         return regexText.test(item.name);
        })

        const result = expressList.filter((item)=>{
         return regexText.test(item.name);
        })
        const filterResult = result.map((item)=>{ return {value:item.code,label:item.name} })

        console.log('查看find结果',{value:find.code,label:find.name});

        courierValue.value = { value:find.code,label:find.name }
        filterOption.value = filterResult

      }else{
        courierValue.value = ''
      }
    }

    // 监听快递单号自动识别功能
    const getCourierNumber = () =>{
      // if(data.courierNum !== ''){
      //   const result =  getCourierName(data.courierNum)
      //   courierValue.value = {value:result.code,label:result.name}
      // }
    }
    
    // 删除快递
    const removeCourier = () =>{

    }

    onMounted(()=>{
      addCourier.getDbCourier()
    })
   

    return {
      optionList,infoList,courierValue,filterOption,
      ...toRefs(data),
      searchCourier,removeCourier,
      close,addInfo,addCourierData,getCourierNumber
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