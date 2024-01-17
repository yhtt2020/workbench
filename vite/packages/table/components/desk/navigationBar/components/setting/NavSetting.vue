<template>
    <div class=" rounded-xl" :style="{ height: `${windowHeight}px`, width: `${windowWidth}px` }">
        <div class="w-full h-[255px] xt-bg-2 rounded-xl p-4">
            <settingItem :settingItem="navigationPosition" @change="change"></settingItem>
        </div>
        <div class="w-full h-[340px] xt-bg-2 rounded-xl mt-3 p-4">
            <settingItem :settingItem="navigationFunction" @change="changeFn"></settingItem>
        </div>

    </div>
</template>

<script setup lang='ts'>
import { ref,onBeforeUnmount,onMounted,watch,toRefs } from 'vue'
import settingItem from './settingItem.vue';
import { useNavigationStore } from '../../navigationStore';
import { appStore } from '../../../../../store';
import { navStore } from '../../../../../store/nav'
import { message } from 'ant-design-vue';
const useNavStore = navStore()
const useAppStore=appStore()
const navigationStore=useNavigationStore()
const windowHeight=ref(480)
const windowWidth=ref(460)

const {copyFootNav,sideNavigationList,rightNavigationList,navigationToggle}=toRefs(useNavStore)

const navigationPosition = ref([
  {
    title: '左侧导航',
    description: '在工作台左侧显示导航栏',
    switch: useNavStore.navigationToggle[0]
  },
  {
    title: '右侧导航',
    description: '在工作台右侧显示导航栏',
    switch: useNavStore.navigationToggle[1]
  },
  {
    title: '底部导航',
    description: '在工作台底部显示导航栏',
    switch: useNavStore.navigationToggle[2]
  }
])

const navigationFunction=ref([
    {
        title:'用户中心',
        description:'在工作台底部显示用户中心',
        switch:navigationStore.bottomToggle[0]
    },
    {
        title:'社区助手',
        description:'在工作台底部显示社区助手',
        tag:'community',
        switch:navigationStore.bottomToggle[1]
    },
    {
        title:'任务中心',
        description:'在工作台底部显示任务中心',
        tag:'task',
        switch:navigationStore.bottomToggle[2]
    },
    {
        title:'社群沟通',
        description:'在工作台底部显示社群沟通',
        tag:'chat',
        switch:useAppStore.settings.enableChat
    }
])
const handleResize = () => {
    const currentHeight = window.innerHeight
    if(currentHeight>850){
        windowHeight.value=610
        windowWidth.value=460
    }else{
        windowHeight.value=480
        windowWidth.value=460
    }
}
onMounted(()=>{
    handleResize()
    window.addEventListener('resize', handleResize)
})
onBeforeUnmount(()=>{
    window.removeEventListener('resize', handleResize)
})
/**
 * 导航栏隐藏
 * @param item 
 * @param index 
 */
const change=(item,index)=>{
    // console.log(item,index);
    
    if(item.switch){
        useNavStore.navigationToggle[index]=item.switch
    }else{
        if(checkList(index)){
            useNavStore.navigationToggle[index]=item.switch
        }else{
            useNavStore.navigationToggle[index]=!item.switch
            item.switch=!item.switch
            message.info('至少保留一个主页图标');
        }
    }
    
}
const checkList = (index)=>{
    const left = navigationToggle.value[0] ? sideNavigationList.value : []
    const right = navigationToggle.value[1] ? rightNavigationList.value : []
    const bottom = navigationToggle.value[2] ? copyFootNav.value : []
    let arr
    switch (index) {
        case 0:
            arr = [...right, ...bottom]
            break;

        case 1:
            arr = [...left, ...bottom]
            break;
        
        case 2:
            arr = [...left, ...right]
            break;
    
        default:
            break;
    }
    if(arr.some(item => item.value === 'home')){
        return true
    }
    return false
}
/**
 * 用户中心，社区中心，任务中心，社群沟通
 * @param item 
 * @param index 
 */
const changeFn=(item,index)=>{
    // console.log(item,index);
    if(index === 3){
        useAppStore.settings.enableChat = item.switch
    }
    navigationStore.bottomToggle[index]=item.switch
}

</script>
<style lang='scss' scoped></style>