<template>
    <div class="w-full h-full">
        <div v-if="props.recommendation==='recommendation'">
            <div class="flex justify-center"><xt-new-icon icon="fluent-emoji:rocket" size="50" /></div>
            <div class="flex justify-between xt-bg-2 p-2 rounded-lg mt-5">
                <div class="xt-text">你可以直接拖拽Windows系统文件或应用快捷方式到导航栏；我们还为你推荐了以下应用图标供你添加选择。</div>
                <div class="pointer" style="color:var(--active-bg)">全部添加</div>
            </div>
        </div>
        <div class="mt-3 flex flex-wrap">
            <selectIcon v-for="(item,index) in suggestNavigationList" :item="item" :recommendation="props.recommendation"/>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive,computed } from 'vue'
import selectIcon from './selectIcon.vue'
import { webMenus } from '../index'
const props=defineProps({
  recommendation:String  
})
const suggestNavigationList = [

  {
    type: 'systemApp',
    icon: 'fluent:chat-16-regular',
    name: '社群(开发中)',
    event:'chat',
    tab:'community',
   fn:()=>{
     vm.$router.push({ name: 'chat' })
   }
  },
  {
    type: 'systemApp',
    icon: 'fluent:document-bullet-list-multiple-24-regular',
    name: '办公',
    tab:'work',
    event: 'work',
  },
  {
    type: 'systemApp',
    icon: 'fluent:games-16-regular',
    name: '游戏',
    tab:'game',
    event: 'gameIndex'
  },

  {
    type: 'systemApp',
    icon: 'fluent:globe-16-regular',
    name: '浏览器',
    event: 'browser',
  },

  {
    type: 'systemApp',
    icon: 'fluent:music-note-2-16-regular',
    name: '音乐',
    event: 'music'
  },

  {
    type: 'systemApp',
    icon: 'fluent:image-multiple-16-regular',
    name: '壁纸',
    tab:'paper',
    event: 'my',
  },

]
</script>
<style lang='scss' scoped>

</style>