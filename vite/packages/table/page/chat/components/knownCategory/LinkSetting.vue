<template>
  <xt-modal v-model="linkVisible" v-if="linkVisible" title="自定义网页链接">
    <div class="flex flex-col" style="width:500px;">
      <div class="flex flex-col p-4 mb-4 rounded-lg xt-bg-2">
        <span class="font-16 font-400 xt-font  xt-text mb-2.5">操作指南</span>
        <span class="font-14 font-400 xt-font xt-text-2">
         输入带有“https://”或“http://”前缀的，完整的网页地址。支持选择点击链接后的打开方式，默认使用工作台设置。
        </span>
      </div>

      <a-input class="h-10 xt-bg-2" v-model:value="linkName" ref="linkNameRef" style="border-radius: 12px; margin-bottom: 16px;" placeholder="链接名称" />

      <a-input-group compact>
        <a-select v-model:value="requestProtocol" style="width:20%;">
          <a-select-option value="https">https</a-select-option>
          <a-select-option value="http">http</a-select-option>
        </a-select>
        <a-input v-model:value="link" ref="linkRef" class="xt-bg-2" placeholder="请输入" spellcheck="false" style="width: 80%;height:40px !important;border-top-right-radius: 8px !important;border-bottom-right-radius:8px;" />
      </a-input-group>

      <span class="mt-4 font-16 font-400 xt-font xt-text">链接打开方式</span>

      <xt-option-tab :list="openList" v-model="linkOpen" style="height: 40px;margin: 16px 0 !important;"></xt-option-tab>

      <template v-if="linkOpen === 'outer'">
        <!-- <xt-option-tab :list="browserType" v-model="browserOpen" style="height: 40px;margin:0 0 16px 0 !important;"></xt-option-tab> -->
        <dropDown :list="browserType" v-model:mode="mode"></dropDown>
      </template>

      <div class="flex items-center justify-end">
        <xt-button w="64" h="40" class="mr-3 category-button" @click="linkVisible = false">取消</xt-button>
        <xt-button w="64" h="40" class="category-button" type="theme" @click="submitSelect">确定</xt-button>
      </div>
    </div>
  </xt-modal>
</template>

<script setup>
import {ref,computed,watch,onMounted,nextTick, defineAsyncComponent} from 'vue';
import { communityStore } from '../../store/communityStore';
import { message } from 'ant-design-vue';

const com = communityStore();

const dropDown = defineAsyncComponent(
  () => import('../../../../../table/components/desk/navigationBar/components/dropDown/DropDown.vue'));

const props = defineProps({
  no:{
    type:String,
  },
  item:{
    type:Object,
    default:()=>{}
  }
})

// 开启弹窗
const linkVisible = ref(false);
// 链接名称
const linkName = ref('');
// https协议选择
const requestProtocol = ref('https');
// 链接域名
const link = ref('');
// 链接页面打开方式默认选择
const linkOpen = ref('current');
// 浏览器打开方式默认选择
const browserOpen = ref('systemSelect')

// 链接页面打开方式
const mode = ref('systemSelect')

// 链接页面打开方式选择
const openList = ref([
  {name:'当前页面直接打开',value:'current',openMethod:'currentPage'},
  {name:'外部跳转打开',value:'outer',openMethod:'outerOpen'}, 
]);
// 浏览器打开方式选择
const browserType = ref([
{
      icon:'mingcute:windows-line',
      name:'系统默认浏览器',
      value:'systemSelect',
      info:'使用Windows系统默认浏览器打开'
  },
  {
      icon:'fluent:globe-16-regular',
      name:'工作台内置浏览器',
      value:'userSelect',
      info:'在工作台内直接打开，不会跳转到外部应用软件。'
  },
  {
      icon:'fluent:globe-16-regular',
      name:'想天浏览器',
      value:'thinksky',
      info:'使用想天浏览器打开'
  },
  {
      icon:'fluent:phone-16-regular',
      name:'手机模式',
      value:'mob',
      info:'使用想天浏览器内置的「手机模式」打开，可以模拟手机端的浏览状态。'
  }
]);

watch(
  () => mode.value,
  (val) => {
    browserOpen.value = val
  }
)

/**事件**/
// 开启弹窗事件
const openLinkModal = () =>{
  linkVisible.value = true;
};
// 提交修改
const submitSelect = async () =>{
  const type = linkOpen.value === 'current';
  let updateLinkOption;
  if(type){
    updateLinkOption = JSON.stringify({
      url:`${requestProtocol.value}://${link.value}`,
      openMethod:openList.value[0].openMethod,
    })
  }
  else {
    const find = browserType.value.find((findItem)=>{ return findItem.value === browserOpen.value });
    updateLinkOption = JSON.stringify({
      url:`${requestProtocol.value}://${link.value}`,
      openMethod:find.value,
    });
  }
  const result = await com.updateCategoryData({...props.item,props:updateLinkOption,name:linkName.value},props.no);
  if(result?.status === 1){
    message.success(`${result?.info}`);
    linkVisible.value = false;
  }
};

onMounted(()=>{
  nextTick(()=>{
    // 将有的数据进行重新赋值
    if(props.item){
      const url = props.item.props.url;
      // 匹配url的http请求协议
      const isHttps = /^(https?)/;
      const isHttp = /^(http?)/;
      if(isHttps.test(url)){
        link.value = url.slice(8);
      }
      else if(isHttp.test(url)){
       link.value =  url.slice(7);
      }
      linkName.value = props.item.name;
    }
  })
});

// 监听选择状态
watch(()=>props.item.props.openMethod,(newVal)=>{
  if( newVal === 'currentPage'){
    linkOpen.value = 'current';
  } else {
    linkOpen.value = 'outer';
    browserOpen.value = newVal || browserOpen.value;
  }
  // if(newVal === 'currentPage'){
  //   linkOpen.value = 'current';
  // }
  // else if(newVal === 'userSelect'){
  //   linkOpen.value = 'outer';
  //   browserOpen.value = 'inter';
  // }
  // else {
  //   linkOpen.value = 'outer';
  //   browserOpen.value = 'inter';
  // }
},{immediate:true,deep:true});

defineExpose({
  openLinkModal
})
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