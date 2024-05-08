<template>
    <div class="flex flex-wrap gap-3">
        <template v-for="(item,index) in list" :key="index">
            <!-- <xt-menu :menus="menus" @onMounted="open(item)"> -->
                <Item 
                    :item="item" 
                    :size="100"
                    @clickItem="open"
                />
            <!-- </xt-menu> -->
        </template>
        
    </div>
</template>

<script setup lang='ts'>
import { ref, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router';

import { startApp } from '../../../../../ui/hooks/useStartApp';

const props = defineProps({
    list: {
        type: Array,
        default: () => []
    }
})

const Item = defineAsyncComponent(() => import('./Item.vue'))

const router = useRouter()

const open = (item) => {
    item.lastUseTime = Date.now()
    startApp(item.type,item.value,router)
    console.log(item,'open item')
}

const menus = ref([
    {
        name: '打开应用',
        newIcon:'fluent:open-16-regular',
        callBack: () => {
            console.log('打开应用')
        }
    }
])


</script>
<style lang='scss' scoped></style>