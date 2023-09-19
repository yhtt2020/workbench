<template>

    <Widget @click="onHistoryMessage" :customData="customData" :customIndex="customIndex" :options="options" ref="homelSlotRef" :desk="desk" >
        <div class="top-icon">
            <Icon icon="fluent:arrow-trending-lines-20-filled" />
        </div>

    </Widget>


</template>
  
<script>
import axios from "axios";
import Widget from "../../card/Widget.vue";
import { Icon } from '@iconify/vue';
export default {
    components:{
        Widget,
        Icon,
    },

    props: {
        customIndex: {
            type: Number,
            default: 0,
        },
        customData: {
            type: Object,
            default: () => { },
        },
        menuList: {
            type: Array,
        },
        desk: {
            type: Object,
        },
        editing: {
            type: Boolean,
        },
    },
    data() {
        return {
            options: {
                className: "card double",
                title: "社区数据图表",
                // icon: "bianji",
                // icon: "shezhi1",
                icon: "iconamoon:history-fill",
                // icon: "games-16-filled",
            },
            history:{
                date:"",
                tetle:""
            },
        };
    },
    async mounted() {

    },
    methods:{

    }
};
</script>
  
<style lang="scss" scoped>
    .top-icon{
        position: absolute;
        top:18px;
    }
    .top-icon svg{
        width:20px;
        height:20px;
    }
</style>
  