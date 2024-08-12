<template>
    <xt-modal v-if="settingVisible" v-model="settingVisible" title="元社区内容小组件设置" @close="close" :full="true" :footer="false" :mask="0">
        <div style="min-width: 452px;max-width: 1000px;">
            <div class="w-full h-full p-4 rounded-xl xt-bg-2" >
<!--                <div class="text-base xt-text">数据源</div>-->
<!--                <div class="mt-2 text-sm xt-text-2">选择需要在小组件上展示的数据源</div>-->
<!--                <xt-option-tab-->
<!--                    class="mt-4 "-->
<!--                    :list="dataList"-->
<!--                    :circle="true"-->
<!--                    style="height: 40px;"-->
<!--                    v-model="currentData">-->
<!--                </xt-option-tab>-->
<!--                <div class="mt-4 mb-4 h-[1px] w-full " style="background: var(&#45;&#45;divider);"></div>-->
                <div class="text-base xt-text">内容设置</div>
                <div class="mt-2 mb-4 text-sm xt-text-2">最多支持在小组件上展示5个内容</div>
                <!-- <xt-option-multiple
                    v-model:multiple="defaultForum"
                    class="mt-4"
                    :list="forumList"
                    @cb="getCurrentList">
                </xt-option-multiple> -->
                <Select
                    v-model:multiple="defaultForum"
                    :list="forumList"
                    @cb="getCurrentList">
                </Select>
            </div>
<!--            <div class="w-full h-full p-4 mt-4 rounded-xl xt-bg-2">-->
<!--                <div class="text-base xt-text">内容打开方式</div>-->
<!--                <div class="mt-2 text-sm xt-text-2">选择点击查看内容后的打开方式</div>-->
<!--                <xt-option-tab-->
<!--                    class="mt-4"-->
<!--                    :list="openWay"-->
<!--                    :circle="true"-->
<!--                    style="height: 40px;"-->
<!--                    v-model="currentWay">-->
<!--                </xt-option-tab>-->
<!--            </div>-->
        </div>

    </xt-modal>
</template>

<script setup lang='ts'>
import { ref, reactive,computed,watch,toRefs,onMounted} from 'vue'
import { dataList, openWay } from './Detail/options';
import {yuanCommunityStore} from '../../../store/yuanCommunity.ts'
import { storeToRefs } from 'pinia';
import Select from './Select.vue'
// 板块接口数据
const store = yuanCommunityStore()
const {myForumList} = storeToRefs(store)

const props = defineProps({
    settingVisible: Boolean,
    defaultForum: Object,
    forumList:Array
})

const currentWay = ref('window')
const currentData = ref('circle')
const {forumList,defaultForum,settingVisible} = toRefs(props)

const emit = defineEmits(['update:settingVisible','forumList'])

// 选择的板块
const getCurrentList = (value)=>{
    const list = forumList.value?.filter(item => value.includes(item.value));
    emit('forumList',list)
}

// 关闭设置
const close = ()=>{
    emit('update:settingVisible',false)
}

// 数据源切换
watch(()=>currentData.value,async(newV,oldV)=>{
    if(newV === 'circle' ){
        await store.getMyForumList();
        forumList.value = myForumList.value
    }else{
      console.log('暂不支持，敬请期待!!!!!')
    }
},{immediate:true})

</script>
<style lang='scss' scoped></style>
