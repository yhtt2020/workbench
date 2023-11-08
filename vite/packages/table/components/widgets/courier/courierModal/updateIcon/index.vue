<template>
  <div class="flex items-center justify-between mb-3">
   <div class="flex">
    <div class="flex items-center justify-center rounded-lg w-14 h-14 pointer category-button xt-bg-2" @click="onUpdateImg">
     <a-avatar :size="32" :src="detailAvatar"></a-avatar>
    </div>
    <div class="flex flex-col ml-3">
     <div class="flex ">
       <span class="mr-1 xt-font font-16 font-600 xt-text">{{ orderData?.LogisticCode }}</span>
       <SmallIcon icon="akar-icons:edit" class="xt-text pointer" style="font-size: 1.5rem;" @click="editCourier"/>
     </div>
     <div class="px-1.5 py-0.5">
      <span class="xt-font xt-text-2 font-14 font-400">{{ switchCompany }}</span>
      <span class="ml-1 xt-font xt-text-2 font-14 font-400">{{ orderData?.LogisticCode }}</span>
     </div>
    </div>
   </div>
   <GoodIcon v-show="goodIconVisible" :goodVisible="false" :windowHeight="innerHeight" @getAvatar="getAvatar" />
   
   <div class="flex items-center">
    <xt-button w="32" h="32" style="border-radius: 8px;">
      <div class="flex items-center justify-center" v-if="true">
        <SmallIcon icon="fluent:star-12-regular"/>
      </div>
      <div class="flex items-center " v-else>
        <SmallIcon icon="fluent:star-16-filled" style="color: var(--warning);"/>
      </div>
    </xt-button>
  
    <MoreDrop class="ml-3" :navList="jdTbList"/>
   </div>
  </div>   
</template>
 
<script>
import { Icon as SmallIcon } from '@iconify/vue'
import {kdCompany} from '../../mock'
import { Modal,message } from 'ant-design-vue'
 
import GoodIcon from '../../../../../../selectIcon/page/index.vue';
import MoreDrop from '../dropdown/MoreDropIcon.vue';

 
export default {
  props:['orderData'],
  components:{
   SmallIcon,
   GoodIcon,MoreDrop,
  },
  data(){
   return{
    detailAvatar:`https://a.apps.vip/icons/goodSelect/package.svg`,
    goodIconVisible:false,
    innerHeight:100,
    moreList:[
      {
        title:'编辑快递',icon:'akar-icons:edit',
        callBack:()=>{
        }
      },
      {
        title:'删除快递', icon:'akar-icons:trash-can', color:'var(--error)',
        callBack:()=>{
          Modal.confirm({
            content: '确认删除当前快递物流信息',
             centered: true,
             onOk: () => {

             }
          })
        }
      }
    ],
    jdTbList:[
      {
        title:'编辑快递',icon:'akar-icons:edit',
        callBack:()=>{

        }
      },
      {
        title:'隐藏快递',icon:'fluent:eye-off-16-regular',
        callBack:()=>{

        }
      }
    ]
   }
  },
 
  computed:{
   switchCompany(){
     return kdCompany(this.orderData.ShipperCode)
   }
  },
 
  methods:{
   editCourier(){},
   onUpdateImg(){
    this.goodIconVisible = !this.goodIconVisible
   },
   removeItem(){},
   // 获取头像
   getAvatar(avatar){
     if(avatar.indexOf('color=') >= 0){
       let color = avatar.substr(avatar.indexOf('color=') + 7 ,6)
       this.bgColor = color
     }else{
       this.bgColor = ''
     }
     this.detailAvatar = avatar
   },
   
  }
}
</script>
 
<style lang="scss" scoped>
 :deep(.float-icon){
   top:125px !important;
 }
</style>