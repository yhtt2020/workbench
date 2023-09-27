<template>
    <vue-custom-scrollbar class="h-full" 
    :settings=" {
        default: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
        }
    }">
        <!-- 文章 -->
        <!-- <h2 v-html="emptyArticle.title"></h2>
        <div v-html="emptyArticle.content"></div>
        <div v-html="emptyArticle.content"></div> -->
    </vue-custom-scrollbar>
</template>

<script>
export default {
name: "article"

}
</script>

<style scoped>

</style>
