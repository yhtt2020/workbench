<template>
  <xt-menu name="name" :menus="menus" @contextmenu.stop="revID = item">
    <div class="flex items-center relative" @click="currentItem(item)">
      <div class="flex items-center">
        <template v-if="item.type === 'group'">
          <CommunityIcon icon="fluent-emoji-flat:thought-balloon" style="font-size: 1.25rem;"/>
        </template>
        <template v-if="item.type === 'link'">
          <CommunityIcon icon="fluent-emoji-flat:globe-with-meridians" style="font-size: 1.25rem;"/>
        </template>
        <template v-if="item.type === 'forum'">
          <CommunityIcon icon="fluent-emoji-flat:placard" style="font-size: 1.25rem;"/>
        </template>
      </div>
      <span class="font-16 font-500 ml-2 truncate" style="color: var(--primary-text);max-width: 110px;">{{ item.name || item.title }}</span>
      <CommunityIcon  icon="fluent:open-20-filled" class="ml-1 xt-text-2 flip " style="font-size: 1.2rem;"
       v-if="item.type === 'link' && item.name !== 'Roadmap' && item.props?.openMethod !== 'currentPage'"/>
       <div style="width:12px;height: 12px;background: red; font-size: 10px;text-align: center;" 
        class="rounded-full flex items-center justify-center ml-2 xt-active-text"   v-if="unread !== null && unread !== 0"
       >
        {{ unread }}
       </div>
    </div>
  </xt-menu>

  <!-- <LinkSetting ref="linkRef" :no="no" :item="item" :id="item.id"/> -->
</template>

<script>
import {ref,reactive,computed,nextTick,toRefs,watch} from 'vue'
import { mapActions,mapWritableState,storeToRefs } from 'pinia'
import { Icon as CommunityIcon } from '@iconify/vue'
import { Modal,message } from 'ant-design-vue'
import { communityStore } from '../../store/communityStore';
import { chatStore } from '../../../../store/chat'

import LinkSetting from '../knownCategory/LinkSetting.vue'

export default {
  props:['item','type','no'],

  components:{
    CommunityIcon,LinkSetting
  },

  setup(props,ctx){
    const linkRef = ref(null)

    const community = communityStore()
    const chat = chatStore()

    const data = reactive({
      revID:'',
      prop:props.item.props,
    })
    const linkMenus = ref([
     {
      name:'链接设置', newIcon:'fluent:settings-16-regular',
      callBack:()=>{ linkRef.value.openLinkModal()}
     },
     {
      name:'删除应用', newIcon:'akar-icons:trash-can',color: 'var(--error)',
      callBack:()=>{
        Modal.confirm({
          content:'删除分类操作不可撤销，分类被删除后，子应用将被移动到顶层。是否确定删除？',
          centered:true,
          onOk: async ()=>{
            const res = await community.removeCategory(data.revID.id,props.no);
            message.success(`${res.info}`);
          }
        })
      }
     }
    ])
    const menuList = ref([
      // {
      //   name:'应用设置',
      //   newIcon:'fluent:settings-16-regular',
      //   callBack:()=>{}
      // },
      {
        name:'删除应用',newIcon:'akar-icons:trash-can',color: 'var(--error)',
        callBack:()=>{
          Modal.confirm({
            content:'删除分类操作不可撤销，分类被删除后，子应用将被移动到顶层。是否确定删除？',
            centered:true,
            onOk: async ()=>{
              const res = await community.removeCategory(data.revID.id,props.no);
              message.success(`${res.info}`);
            }
          })
        }
      },
    ])

    const menus = computed(()=>{
      if(props.type === 'link'){
        return linkMenus.value
      }else{
        return menuList.value
      }
    })

    const currentItem = (item) =>{
      ctx.emit('currentItem',item)
    }

    const unread = computed(()=>{
      const jsonProp = props.item.props;
      if(jsonProp.hasOwnProperty('unread')){
        return jsonProp.unread > 99 ? 99 : jsonProp.unread;
      }else{
        return 0;
      }
    })

    return{
      linkRef,menus,linkMenus,menuList,unread,
      ...toRefs(data),currentItem,
    }
  }
};
</script>

<style lang="scss" scoped>
</style>