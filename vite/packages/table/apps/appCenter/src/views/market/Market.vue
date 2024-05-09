<template>
    <Header 
        title="应用市场"
        icon="fluent:building-shop-16-regular"
    >
        <template #right>
            <xt-button w="98" h="32" radius="8" icon="">我要上架</xt-button>
            <xt-button w="127" h="32" radius="8" type="theme">全部应用（{{ 98 }}）</xt-button>
        </template>
    </Header>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import Header from '../../component/Header.vue';

</script>
<style lang='scss' scoped></style>