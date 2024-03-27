<template>
    <div class="flex" style="gap: 16px;">
        <div v-for="(item,index) in copyFootNav" :key="index" @click="openApp(item)">
            <Drag :data="item">
                <a-tooltip 
                    :title="item.name" 
                    :placement="placement">
                    <Avatar
                        :size="44"
                        :item="item" />
                </a-tooltip> 
            </Drag>
            
        </div> 
    </div>
    
</template>

<script setup lang='ts'>
import { ref , toRefs , inject , onMounted} from 'vue'
import { storeToRefs } from 'pinia';

import { startApp } from '../../../ui/hooks/useStartApp';

import { navStore } from '../../../store/nav';
import Avatar from './Avatar.vue';
import Drag from '../../desk/navigationBar/components/folder/Drag.vue';

type PropsType = {
    // 文字提示弹出位置
    placement:string,
}

const useNavStore = navStore()
const { copyFootNav } = storeToRefs(useNavStore)

// 通过注入的方式传递size
const size = inject('iconSize',52)

const props = withDefaults(defineProps<PropsType>(), {
    placement: 'top',
})

const { placement } = toRefs(props)

// 打开应用
const openApp = (item:any) => {
    const { type , value } = item
    console.log(type,value)
    startApp(item)
}

</script>
<style lang='scss' scoped></style>