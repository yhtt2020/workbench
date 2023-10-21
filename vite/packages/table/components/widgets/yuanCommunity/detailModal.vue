<template>
    <Modal :maskNoClose="true" class="" :animationName="t-b-close">
        <Detail></Detail>
    </Modal>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import Detail from '../../../page/chat/com/detail.vue';

</script>
<style lang='scss' scoped></style>