<template>
  <div :class="options.className" :style="{pointerEvents:(editing?'none':'')}">
    <div :class="options.noTitle===true?'no-title':'content-title'">
      <div class="left-title" v-if="options.noTitle!==true">
      <Icon :icon="options.icon" class="title-icon"></Icon>
      <div>{{options.title}}</div>
    </div>
      <div class="right-title" @click.stop="showDrawer">
        <Icon icon="gengduo1" class="title-icon" style="cursor:pointer"></Icon>
      </div>
    </div>
    <slot :customIndex="customIndex"></slot>
  </div>
  <a-drawer
    :contentWrapperStyle="{ padding:10,marginLeft:'2.5%',
    backgroundColor:'#1F1F1F',width: '95%',height:'11em',borderRadius:'5%'}"
    :width="120"
    :height="120"
    class="drawer"
    :closable="false"
    placement="bottom"
    :visible="visible"
    @close="onClose"
  >
    <div style="display: flex;flex-direction: row;height: 100%">
      <div class="option" @click="onSetup" v-if="!options.type">
        <Icon class="icon" icon="shezhi1"></Icon>设置
      </div>
      <div class="option" @click="removeCard">
        <Icon class="icon" icon="guanbi2"></Icon>删除
      </div>
    </div>
  </a-drawer>
</template>

<script>
import {mapActions} from "pinia";
import {tableStore} from "../../store";

export default {
  data(){
    return {
      visible:false,
    }
  },
  name: "HomeComponentSlot",

  props:{
    options: {
      type: Object,
      default: () => ({})
    },
    editing:{
      type:Boolean,
      default:false
    },
    customIndex:{
      type:Number,
      default:0
    }
  },
  methods:{
    ...mapActions(tableStore, ["removeCustomComponents"]),
    showDrawer()  {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
    removeCard(){
      console.log(this.customIndex)
      this.removeCustomComponents(this.customIndex)
      this.visible = false;
    },
    onSetup(){
      switch (this.options.title){
        case "倒数日":
          this.$router.push({
            name: "addCardSetting",
            params: {
              name: 'countdownDay',
              cname: '倒数日',
            },
          });break;
      }

    },
  }
}
</script>

<style lang="scss" scoped>
.no-title{
  .title-icon{
    width: 24px;
    height: 24px;
    color: #818181;
  }
  .right-title{
   position: absolute;
    top: 1em;
    right: 1em;
  }
}
.content-title{
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  .left-title{

    display: flex;
    width: 35%;
    align-items: center;


    .title-icon{
      width: 24px;
      height: 24px;
    }
    :last-child{
      margin-left: .5em;
    }
  }
  .right-title{

    align-items: center;
    display: flex;

    .title-icon{
      width: 24px;
      height: 24px;
      color: #818181;
    }
  }

}
.option{
  background: #161616;
  width: 8em;
  height:100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10%;
  margin-left: 1.8em;
  cursor:pointer;
  .icon{
    width: 3em;
    height: 3em;
    vertical-align: middle;
  }
}
</style>
