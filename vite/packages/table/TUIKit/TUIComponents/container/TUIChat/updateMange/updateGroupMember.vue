<template>
 <div class="flex flex-col rounded-lg" style="background: var(--secondary-bg);">
   <div v-for="item in memberInfo.memberList" class="flex justify-between" style="padding: 16px;color: var(--primary-text);margin-bottom: ;">
    <div class="flex items-center ">
     <a-avatar :src="item.avatar" :size="32"></a-avatar>
     <span style="margin-left: 12px;">{{item.nick}}</span>
    </div>


    <div class="font-14" style="color: var(--secondary-text);">{{ handleRoleName(item) }}</div>

   </div>
 </div>
</template>

<script>
import { defineComponent,ref,reactive,toRefs, onMounted } from 'vue'
import { appStore } from '../../../../../store'

export default defineComponent({
 props:['memberInfo','server'],

 setup(props,ctx){
  const server = props.server.TUICore
  const types = server.TIM.TYPES;


  const store = appStore()

  const handleRoleName = (item) => {  // 区分群组角色
   const { t } = server.config.i18n.useI18n();
   let name = '';
   switch (item?.role) {
    case types.GRP_MBR_ROLE_ADMIN:
     name = t('TUIChat.manage.管理员');
     break;
    case types.GRP_MBR_ROLE_OWNER:
     name = t('TUIChat.manage.群主');
     break;
   }
   if (name) {
    name = `(${name})`;
   }

   if (parseInt(item.userID) === parseInt(store.$state.userInfo.uid)) {
    name += `(${t('TUIChat.manage.我')})`
   }
   return name;
  }

  return{

   store,
   handleRoleName,
  }
 }
})
</script>

<style lang="scss" scoped>
.font-14{

 font-size: 14px;
 font-weight: 400;
}
</style>
