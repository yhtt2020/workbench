<template>
 <div class="flex items-center justify-center h-12 relative mr-3 no-drag">
  <xt-menu :menus="menus" model="click" name="name"  v-if="assistStatus">
   <div style="max-width: 88px;"  class="p-1 btn-hover  rounded-md pointer category-button" >
    <div class="flex items-center justify-center">
    <div class="mr-1 flex items-center justify-center">
     <TopButtonIcon icon="fluent:accessibility-16-regular" class="xt-text" style="font-size: 1.25rem;"/>
    </div>
    <span class="xt-text xt-font font-14">辅助模式</span>
    </div>
   </div>
  </xt-menu>
 </div>
</template>

<script setup>
import { ref,computed,} from 'vue';
import { storeToRefs } from 'pinia';
import { appStore} from '../../store';
import { Icon as TopButtonIcon } from '@iconify/vue';

const app = appStore();
const {  aided } = storeToRefs(app);

const assistStatus = computed(()=>{
 return aided.value
})

const menus = ref([
  {
   newIcon:'fluent:accessibility-16-regular',
   name:'关闭辅助模式',
   callBack:()=>{
    // aided.value = false;
    app.leaveAided()
   }
  },
])
</script>

<style lang="scss" scoped>
.btn-hover{
 &:hover{
  background: var(--secondary-transp-bg) !important;
 }
}
</style>