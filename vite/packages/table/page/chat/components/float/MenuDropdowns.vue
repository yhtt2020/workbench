<template>
  <xt-menu name="name" :menus="menus" @contextmenu="revID = item">
    <div class="flex items-center" @click="currentItem(item)">
      <div class="flex items-center">
        <template v-if="item.type === 'group'">
          <CommunityIcon icon="fluent-emoji-flat:thought-balloon" style="font-size: 2em;"/>
        </template>
        <template v-if="item.type === 'link'">
          <CommunityIcon icon="fluent-emoji-flat:globe-with-meridians" style="font-size: 2em;"/>
        </template>
        <template v-if="item.type === 'forum'">
          <CommunityIcon icon="fluent-emoji-flat:placard" style="font-size: 2em;"/>
        </template>
      </div>
      <span class="font-16 ml-2 truncate" style="color: var(--primary-text);">{{ item.name || item.title }}</span>
      <CommunityIcon  icon="fluent:open-20-filled" class="ml-1 xt-text-2 flip " style="font-size: 24px"
       v-if="item.type === 'link' && item.name !== 'Roadmap' && JSON.parse(item.props)?.openMethod !== 'currentPage'"/>
    </div>
  </xt-menu>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia'
import { Icon as CommunityIcon } from '@iconify/vue'
import { Modal,message } from 'ant-design-vue'
import { communityStore } from '../../store/communityStore'

export default {
  props:['item','type','no'],

  components:{
    CommunityIcon
  },

  data(){
    return{
      linkMenus:[
        {
          name:'链接设置',
          newIcon:'fluent:settings-16-regular',
          callBack:()=>{}
        },
        {
          name:'删除应用',
          newIcon:'akar-icons:trash-can',
          color: 'var(--error)',
          callBack:()=>{
            Modal.confirm({
              content:'删除分类操作不可撤销，分类被删除后，子应用将被移动到顶层。是否确定删除？',
              centered:true,
              onOk: async ()=>{
                this.removeCategory(this.revID.id,this.no)
                message.success('删除成功')
              }
            })
          }
        }
      ],
      menus:[
        {
          name:'删除应用',
          newIcon:'akar-icons:trash-can',
          color: 'var(--error)',
          callBack:()=>{
            Modal.confirm({
              content:'删除分类操作不可撤销，分类被删除后，子应用将被移动到顶层。是否确定删除？',
              centered:true,
              onOk: async ()=>{
                this.removeCategory(this.revID.id,this.no)
                message.success('删除成功')
              }
            })
          }
        }
      ],
      revID:''
    }
  },

  computed:{
    menus(){
      if(this.type === 'link'){
        return this.linkMenus
      }else{
        return this.menus
      }
    }
  },

  methods:{
    ...mapActions(communityStore,['removeCategory','getCategoryData','getChannelList']),
    currentItem(item){
      this.$emit('currentItem',item)
    }
  }
};
</script>

<style lang="scss" scoped>
</style>