<template>    
   <xt-left-menu :list="this.menuList" last="2" end="1" >

    <slot></slot>

  </xt-left-menu>
<!-- 全屏 -->
</template>

<script>
// import CreateTopic from "../chat/left/createTopic.vue";
// import { mapWritableState } from "pinia";
// import { aiStore } from "../../../store/ai";
// import Edit from "./edit.vue";
// import { SettingFilled } from "@ant-design/icons-vue";
  import {mapActions, mapState,mapWritableState} from "pinia";
  import { noteStore } from '../store'
export default {
  components: {
    // CreateTopic,
    // Edit,

    // SettingFilled,
  },
  computed: {
      ...mapWritableState(noteStore, ['isSelTab']),
    },
    data() {
    return {
      menuList:[
        {
          // flag: true,
          newIcon: "fluent:notepad-12-regular",
          // isSel:this.isSelTab,
          isSel:false,
          callBack: () => {
            // console.log('便签');
            this.isSelTab = false
            this.getNotes()
          },
        },
        {
          // flag: true,
          newIcon: "akar-icons:trash-can",
          isSel:false,
          callBack: () => {
            // console.log('回收站');
            this.isSelTab = true
            this.getNotes()
          },
        },
        {
          full: true,
        },
      ],

    };
  },
  methods:{
    
    ...mapActions(noteStore, ['getNotes']),
    formatTimestamp(timestamp) {
      var date = new Date(timestamp * 1000);
      var year = date.getFullYear();
      var month = ("0" + (date.getMonth() + 1)).slice(-2);
      var day = ("0" + date.getDate()).slice(-2);
      return year + "-" + month + "-" + day;
    },

  }
};
</script>
<style lang="scss" scoped>
</style>
