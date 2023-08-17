<template>
    <div class="flex flex-row ">
        <div class="option h-24 w-24 ml-4" @click="item.fn()" v-for="item in menuList">
            <Icon class="icon" :icon="item.icon"></Icon>
            {{ item.title }}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        menuList: {
            type: Array,
            default: () => [],
        },
    },
}
</script>

<style lang="scss" scoped></style>