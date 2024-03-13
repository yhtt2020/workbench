<template>
    <WebList 
        @refresh="refresh" 
        @changeIcon="changeIcon" 
        @countFavo="countFavo" 
        @showRenameModal="showRenameModal" 
        :checkFlag="checkFlag" 
        :showList="showList" 
        :menus="menus" 
        :rightMenu="rightMenu">
    </WebList>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import WebList from '../../../../../apps/favorites/components/WebList.vue';

</script>
<style lang='scss' scoped></style>