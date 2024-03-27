<template>
    <div 
        class="
            w-full h-[64px]  pointer 
            flex items-center 
            justify-between p-3 overflow-hidden" 
        style="border: 1px solid var(--divider);background: rgba(26,26,26,0.65);;">
        <MyAvatar></MyAvatar>
        <Panel></Panel>
        <div class="flex">
            <Time></Time>
            <MessageBox :boxClass="'ml-4'"></MessageBox>  
        </div>
        
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import MyAvatar from './small/MyAvatar.vue';
import Time from './windowPanel/Time.vue';
import MessageBox from './windowPanel/MessageBox.vue';
import Panel from './windowPanel/Panel.vue';

</script>
<style lang='scss' scoped></style>