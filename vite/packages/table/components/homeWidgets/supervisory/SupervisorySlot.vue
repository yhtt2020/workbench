<template>
    <div :class="options.className" :style="{pointerEvents:(editing?'none':'')}">
      <div class="left-title">
        <Icon :icon="options.icon" class="title-icon"></Icon>
      <div style="font-size: 1em">{{options.title}}</div>
      </div>
      <div class="right-title" @click.stop="showDrawer">
        <Icon icon="gengduo1" class="title-icon" style="cursor:pointer"></Icon>
      </div>
      <slot></slot>
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

      <div class="option" @click="removeCard">
        <Icon class="icon" icon="guanbi2"></Icon>删除
      </div>
    </div>
  </a-drawer>
</template>

<script>
import {mapActions} from "pinia";
import {tableStore} from "../../../store";

export default {
  data(){
    return {
      visible:false,
    }
  },
  name: "SupervisorySlot",
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
      this.removeCustomComponents(this.customIndex)
      this.visible = false;
    },
  }
}
</script>

<style lang="scss" scoped>
.card{
  max-height:30em;
  border-radius: 8px;
  vertical-align: text-top;

  width: 20em;
  min-width: 20em;
  display: inline-block;
  height: 420px;
  padding: 3em 13px .5em 13px ;
  margin-right: 1em;
  position: relative;
  &.small{
    height: 203px;
   margin-bottom: 14px;
 }
  &.big{

  }
  .left-title{
    position: absolute;
    display: flex;
    width: 35%;
    align-items: center;
    left: 13px;
    top: 8px;

    .title-icon{
      width: 18px;
      height:18px;
    }
    :last-child{
      margin-left: .5em;
    }
  }
  .right-title{
    position: absolute;
    align-items: center;
    display: flex;
    right: 13px;
    top: 8px;
    .title-icon{
    width: 1.5em;
    height: 1.5em;
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
