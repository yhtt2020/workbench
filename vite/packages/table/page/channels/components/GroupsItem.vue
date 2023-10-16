<template>
    <div class="p-4 mr-3 rounded-lg xt-bg" style="width: 220px; height: 220px;">
        <div class="flex w-full h-[40px] items-center">
            <a-avatar shape="square" :size="40" style="border-radius: 12px;">
                <template #icon>
                    <UserOutlined />
                </template>
            </a-avatar>
            <div class="ml-3 xt-text font-16">
                {{ groupMsg[0].name }}
            </div>
        </div>
        <div class="mt-3 mb-2 xt-text font-14">
            {{ groupMsg[0].title }}
        </div>
        <div class="flex justify-between">
            <div class="xt-text-2 font-12">{{ groupMsg[0].memeber }}人</div>
            <div class="xt-text-2 font-12">{{ groupMsg[0].joined }}</div>
        </div>
        <a-divider style="height: 1px; background-color: var(--divider);margin: 0px;margin-top: 12px;"  />
        <xt-button style="width: 100%; height: 40px;margin-top: 12px;background:#508BFE ;">立即加入</xt-button>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
const groupMsg = ref([
    {
        name: '用户圈子',
        title: '一起打磨出闪闪发光的技术宝石！',
        memeber: 123,
        joined: '公开加入',
    }
])
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
</style>