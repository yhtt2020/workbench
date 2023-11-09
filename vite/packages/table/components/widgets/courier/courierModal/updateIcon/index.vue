<template>
  <div class="flex items-center justify-between mb-3">
   <div class="flex">
    <div class="flex items-center justify-center rounded-lg w-14 h-14 pointer category-button xt-bg-2" @click="onUpdateImg">
     <a-avatar :size="32" :src="detailAvatar"></a-avatar>
    </div>
    <div class="flex flex-col ml-3">
     
     <div class="flex ">
       <div v-if="isJd" class="flex items-center rounded-md xt-active-text justify-center w-6 h-6 " style="background: #E12419;">JD</div>
       <div v-if="isTb" class="flex items-center rounded-md xt-active-text justify-center w-6 h-6 " style="background: #FA5000;">淘</div>
       <span class="mx-1 xt-font font-16 font-600 xt-text">{{ orderData?.LogisticCode }}</span>
       <SmallIcon icon="akar-icons:edit" class="xt-text pointer" style="font-size: 1.5rem;" @click="editCourier"/>
     </div>
     <div class="flex items-center">
      <div class="px-1.5 py-0.5 flex items-center xt-bg-2 rounded-md">
        <span class="xt-font xt-text-2 font-14 font-400">{{ switchCompany }}</span>
        <span class="xt-font xt-text-2 font-14 font-400">{{ orderData?.LogisticCode }}</span>
        <div class="flex items-center pointer justify-center" @click="copyOrderNum">
          <SmallIcon icon="fluent:copy-16-regular" class="xt-text-2" style="font-size: 1.25rem;" />
        </div>
      </div>
      <div class="xt-bg-2 flex items-center justify-center px-1 rounded-md mx-2">9150</div>
      <div class="xt-bg-2 w-6 h-6 rounded-md flex items-center justify-center">拆</div>
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

  <EditModal ref="courierEditRef"/>
</template>
 
<script>
import { Icon as SmallIcon } from '@iconify/vue'
import {kdCompany} from '../../mock'
import { Modal,message } from 'ant-design-vue'
import useClipboard from 'vue-clipboard3';
 
import GoodIcon from '../../../../../../selectIcon/page/index.vue';
import MoreDrop from '../dropdown/MoreDropIcon.vue';
import EditModal from '../EditModal.vue';

 
export default {
  props:['orderData'],
  components:{
   SmallIcon,
   GoodIcon,MoreDrop,EditModal
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
          this.$refs.courierEditRef.openEditModal()
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
          this.$refs.courierEditRef.openEditModal()
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

   // 复制订单号
   async copyOrderNum(){
    const { toClipboard } = useClipboard();
    const res = await toClipboard(this.orderData?.LogisticCode);
    if(res.text !== ""){
      message.success('订单号复制成功');
    }
   }
   
  }
}
</script>
 
<style lang="scss" scoped>
 :deep(.float-icon){
   top:125px !important;
 }
</style>