<template>
    <Widget :customData="customData" :customIndex="customIndex" :options="options" ref="homelSlotRef" :desk="desk">
        <div>33</div>
        <div>剪贴板</div>


    </Widget>
</template>
  
<script>
import axios from "axios";
import Widget from "../../card/Widget.vue";
export default {
    components:{
        Widget,
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
                title: "剪贴板",
                icon: "shezhi1",
            },
            history:{},
        };
    },
    async mounted() {

    },
    methods:{

    }
};
</script>
  
<style lang="scss" scoped>

</style>
  