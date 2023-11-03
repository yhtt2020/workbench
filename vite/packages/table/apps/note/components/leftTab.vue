<template>    
   <xt-left-menu :list="this.menuList" last="2" model="id" end="1">

    <slot></slot>

  </xt-left-menu>
<!-- 全屏 -->
</template>

<script>
  import {mapActions, mapState,mapWritableState} from "pinia";
  import { noteStore } from '../store'
export default {
  components: {
  },
  computed: {
      ...mapWritableState(noteStore, ['isSelTab','selNote','searchValue']),
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
            this.menuList[0].isSel=true
            this.menuList[1].isSel=false

            this.selNote=-1
            this.searchValue = ''
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
            this.menuList[0].isSel=false
            this.menuList[1].isSel=true
            
            this.selNote=-1
            this.searchValue = ''
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

  }
};
</script>
<style lang="scss" scoped>
</style>
