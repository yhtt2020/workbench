<template>
    <div>
        <div class="left">
            <div class="no-drag nav" :style="navStyle" :class="{ 'xt-active-btn': currenIndex == item.id }" @click="updateNavIndex(item, index)"
                v-for="( item, index ) in  list" :key="item.name">{{
                item.cname
            }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        // 导航列表
        list: {
            type: Array,
            default: []
        },
        // 选中索引
        currenIndex: {
            type: Number,
            default: 0,
        },
        // 导航样式
        navStyle: {
            type: String,
            default: ''
        }
    },
    methods: {
        // 修改导航索引
        updateNavIndex(item, index){
            this.$emit('changeNav', item)
        }
    }
}
</script>

<style lang="scss" scoped>
    .left {
      height: 95%;
      width: 112px;
      overflow: auto;
      padding-bottom: 40px;
      .nav {
        width: 112px;
        height: 56px;
        border-radius: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        margin-bottom:12px;
        font-size: 16px;
        color:var(--primary-text);
      }
    }
    .left::-webkit-scrollbar{
      display: none;
    }
</style>
