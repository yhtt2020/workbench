<template>
    <tippy placement="top" :interactive="true" :appendTo="body" :arrow="false" trigger="click" :zIndex="999999">
        <div class="w-[58px] h-[58px] ">
            <div class="w-[52px] h-[52px] p-1 flex flex-wrap justify-center items-center"
                :style="{ borderRadius: navigationStore.iconRadius + 'px' }" style="border: 1px solid var(--divider);">
                <div class=" w-[16px] h-[16px]   flex flex-wrap  justify-center items-center"
                    v-for="(item, index) in iconList?.slice(0, 4)"
                    :style="{ marginRight: index == 3 || index == 1 ? '0px' : '4px' }">
                    <a-avatar :size="16" shape="square" :src="item.icon"
                        :style="{ borderRadius: (navigationStore.iconRadius / 4) + 'px' }"></a-avatar>
                </div>
            </div>
        </div>
        <template #content>
            <div class="w-[200px] h-[100px] flex flex-wrap  justify-center items-center">
                <div class=" w-[56px] h-[56px] mb-1 mr-1 flex flex-wrap  justify-center items-center pointer"
                    v-for="item in iconList" @click="startApp(item.type, item.value, router)">
                    <a-avatar :size="56" shape="square" :src="item.icon"
                        :style="{ borderRadius: navigationStore.iconRadius + 'px' }"></a-avatar>
                </div>
            </div>
        </template>
    </tippy>
</template>

<script setup lang='ts'>
import { ref, reactive, computed } from 'vue'
import { useNavigationStore } from '../../navigationStore';
import { startApp } from '../../../../../ui/hooks/useStartApp';
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const navigationStore = useNavigationStore()
// interface props {
//     iconList:{

//     }
// }
const props = defineProps({
    iconList: Array
})
const body = computed(() => {
    return document.body
})
</script>
<style lang='scss' scoped></style>
