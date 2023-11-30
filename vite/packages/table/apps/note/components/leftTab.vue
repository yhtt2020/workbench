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
        flag: true,
        menuList:[
          {
            newIcon: "fluent:notepad-12-regular",
            isSel:false,
            title:'便签',
            callBack: () => {
              if (this.flag) {
                this.flag=false
                this.isSelTab = false
                this.getNotes().then(()=>{
                  this.menuList[0].isSel=true
                  this.menuList[1].isSel=false
                  this.selNote=-1
                  this.searchValue = ''
                  this.flag=true
                })
              }
            },
          },
          {
            newIcon: "akar-icons:trash-can",
            isSel:false,
            title:"回收站",
            callBack: () => {
              if (this.flag) {
                this.flag=false
                this.isSelTab = true
                this.getNotes().then(()=>{
                  this.menuList[0].isSel=false
                  this.menuList[1].isSel=true
                  this.selNote=-1
                  this.searchValue = ''
                  this.flag=true
                })
              }
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
