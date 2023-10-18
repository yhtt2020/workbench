<template>
    <div class="p-4 mb-2 mr-2 rounded-lg xt-bg" style="width: 220px; height: 220px;">
        <!-- <div>111111111111</div> -->
        <div class="flex w-full h-[40px] items-center">
            <a-avatar shape="square" :size="40" style="border-radius: 12px;" :src="circleMsg.logo">
            </a-avatar>
            <div class="ml-3 xt-text font-16">
                {{ circleMsg.name }}
            </div>
        </div>
        <div class="mt-3 mb-2 xt-text font-14 limit">
            {{ circleMsg.title }}
        </div>
        <div class="flex justify-between">
            <div class="xt-text-2 font-12">{{ circleMsg.memeber }}人</div>
            <div class="xt-text-2 font-12">{{ circleMsg.joined }}</div>
        </div>
        <a-divider style="height: 1px; background-color: var(--divider);margin: 0px;margin-top: 12px;"  />
        <xt-button v-if="circleMsg.join=='1'" style="width: 100%; height: 40px;margin-top: 12px;background:var(--primary-bg);">已经加入</xt-button>
        <xt-button v-else-if="circleMsg.way==1" style="width: 100%; height: 40px;margin-top: 12px;background:rgba(80,139,254,0.20);" @click="goDetail">立即加入</xt-button>
        <xt-button v-else style="width: 100%; height: 40px;margin-top: 12px;background:#508BFE ;" @click="goJoin">进入圈子</xt-button>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive,onMounted,computed } from 'vue'
import { useRouter,useRoute } from 'vue-router'
import JoinModal from './JoinModal.vue'
const router = useRouter()
const route = useRoute()
const props=defineProps({
    circleMsg:Object
})
const goDetail = () => {
    router.push({
        name:'circleDetail',
    })
}
const emit=defineEmits(['goJoin'])
const goJoin=()=>{
    let visible=true
    emit('goJoin',visible)
}
</script>
<style lang='scss' scoped>
.font-16 {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    font-weight: 500;
}

.font-14 {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    font-weight: 400;
}

.font-12 {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    font-weight: 400;
}
.limit{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}
</style>