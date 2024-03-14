<template>
    <xt-modal 
        title="添加到桌面" 
        :maskIndex="1001" 
        :index="1002" 
        boxClass="rounded-xl p-4" 
        :mask="true" 
        :header="true"
        :footer="true" 
        v-model="deskFlag" 
        @ok="addDeskIcon">
        <div 
            class="relative flex rounded-xl" 
            style="width: 466px;">
            <xt-select v-model="defaultDesk" :list="deskList" :zIndex="1250"></xt-select>
        </div>
    </xt-modal>
</template>

<script setup lang='ts'>
import { ref, onMounted,computed,watch } from 'vue'
import _ from 'lodash-es'
import { nanoid } from 'nanoid'

import {storeToRefs} from 'pinia'
import {message} from 'ant-design-vue'
import { useAddCard } from '../../../../ui/hooks/useAddCard'
import { useFileConversionIcon } from '../../../../ui/hooks/useDataConversion'

import { cardStore } from '../../../../store/card'
import { homeStore } from '../../../../store/home';
import {useIconStore} from '../store'

const deskFlag = ref(true)
const defaultDesk = ref({})  // 当前选择的桌面id
const chooseDesk = ref({})  // 选择的桌面

// 获取桌面列表
const useCardStore = cardStore()
const { desks } = storeToRefs(useCardStore)

// 获取当前桌面id
const useHomeStore = homeStore()
const { currentDeskId } = storeToRefs(useHomeStore)

// 获取图标列表
const iconStore = useIconStore()
const { multipleList,isMultiple } = storeToRefs(iconStore)


const props = defineProps({
    list: Array,
})

const deskList = computed(() => {
    return desks.value.map((item,index) => {
        return {
            name: item.name,
            value: item.id
        }
    })
})

onMounted(() => {
    const target = deskList.value.find(item => {
        return item.value === currentDeskId.value
    })
    defaultDesk.value = target.value
    console.log(defaultDesk.value)
})

const addDeskIcon = () => {
    if(multipleList.value.length === 0) {
        message.error('请选择图标后再添加到桌面')
        return
    } else {
        multipleList.value.forEach(item => {
            addCard(item)
        })
        multipleList.value = []
        isMultiple.value = false
    }
}

const addCard = (item) =>{
    const file = useFileConversionIcon(item)
    const card = _.cloneDeep(file)
    console.log(card)
    const id = nanoid(6)
    // useAddCard(
    //     'myIcons',
    //     {
    //         iconList:[{...card}],
    //     },
    //     Date.now()
    // )
    chooseDesk.value.cards.push({
        name:'myIcons',
        customData: {
            iconList:[{...card}]
        },
        id,
    })
    
}

watch(() => defaultDesk.value, (val) => {
    chooseDesk.value = desks.value.find(item => {
        return item.id === val
    })
    console.log(chooseDesk.value)
})



</script>
<style lang='scss' scoped></style>