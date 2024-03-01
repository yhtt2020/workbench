<template>
    <div class="p-6 mr-4 rounded-lg grade-card" style=" background:var(--primary-bg)">
        <div class="flex items-center" style="color:var(--primary-text);">
            <xt-new-icon icon="fluent-emoji:star" class="mr-3" :size="18"></xt-new-icon>
            <div class="text-base xt-text-1">等级权益</div>
        </div>
        <!-- 未登录时提示登录  -->
        <LoginTip v-if="!isLogin"></LoginTip>
        <div class="flex flex-row mt-4">
            <div class="mr-4 " style="width: 160px">
                <a-steps direction="vertical" :current="abilityGrade" ref="step" :progressDot="true">
                    <a-step :title="'Lv ' + item" description=" " @click="clickStep(index)" class="left-box"
                        v-for="(item, index) in leveList" style="color:var(--primary-text);font-family: Oswald-SemiBold;" />
                </a-steps>
            </div>
            <div class="flex flex-wrap justify-between w-full ">
                <DetailMsg :list="powerList" :leveList="leveList" :current="clickGrade"></DetailMsg>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted,computed,toRefs } from 'vue'
import LoginTip from './components/LoginTip.vue'
import DetailMsg from './components/DetailMsg.vue';
import { leveList, powerList } from '../../js/data/abilityData'
const step = ref(null)
const clickGrade = ref(0)
const props = defineProps({
    abilityGrade: {
        type: Number,
        default: 0
    },
    isLogin: {
        type: Boolean,
        default: true
    }
})
const { abilityGrade } = toRefs(props)

// 切换等级查看权益
const clickStep = (e: number) => {
    for (let i = 0; i < step.value.$el.children.length; i++) {
        step.value.$el.children[i].children[0].children[2].children[0].style.background = ''
    }
    step.value.$el.children[e].children[0].children[2].children[0].style.background = 'var(--active-secondary-bg)'
    clickGrade.value = e
}

// 进入即查看当前等级权益
onMounted(() => {
    clickStep(abilityGrade.value)
})
</script>
<style lang='scss' scoped>
.left-box {
  :deep(.ant-steps-item-title) {
    color: var(--primary-text) !important;
  }
  :deep(.ant-steps-item-content){
    min-height: 44px;
  }
  :deep(.ant-steps-item-icon-dot){
    
  }
}
</style>