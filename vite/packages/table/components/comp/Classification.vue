<template>
  <div class="add-navigation xt-modal xt-boder">
    <div class=" xt-text">添加导航</div>
    <div @click="closeAdd" class="pointer  xt-bg ">
      <Icon icon="guanbi" class="no-drag xt-text" style="width:18px;height:18px;" ></Icon>
    </div>
    <xt-task  id='M0104' no='5'  >
    </xt-task>
    <div class="add-navigation-content flex flex-row">
      <div class="left-content">
        <div v-for="(item,index) in navClassify" :style="activeItem ===index?' border-right: 1px rgba(22, 119, 255, 1) solid;' :''">
          <div :class="activeItem ===index?'xt-active' :''" @click="clickItem(item,index)" class="xt-text">
            {{item.cname}}
          </div>
        </div>
      </div>
      <div class="right-content  ml-3" style="width: calc(100% - 145px)">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Classification",
  data(){
    return {
      activeItem:0,
    }
  },
computed:{
},
  props:['navClassify','show'],
  methods:{
    closeAdd(){
      this.$emit("update:show", false);
    },
    clickItem(item,index){
      this.activeItem = index;
      this.$emit('clickLeftList',item)
    }
  },
}
</script>

<style lang="scss" scoped>
.add-navigation{
  padding: 16px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: calc(100vw - 20%);
  height: calc(100vh - 10%);
  border-radius: 16px;
  // background: var(--modal-bg);
  max-width: 800px;
  max-height: 600px;
  display: flex;
  flex-direction: column;
  text-align: center;
  >:nth-child(1){
    font-size: 18px;
    color: var(--primary-text);
    margin-top: 8px;
  }
  >:nth-child(2){
    width: 48px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    background:var(--secondary-bg);
    border-radius: 12px;
    position: absolute;
    top: 16px;
    right: 16px;
  }
  .add-navigation-content{
    margin-top: 30px;
    width: 100%;
    height: 80%;
    .left-content{
      width: 136px;
      border-right: 1px  rgba(255, 255, 255, 0.1) solid;
      height: 100%;
      >div{
        width: 136px;
        >div{
          width: 120px;
          height: 56px;
          font-size: 16px;
          font-weight: 400;
          color: var(--primary-text);
          line-height: 56px;
        }
        .xt-active{
          border-radius: 12px;
        }
      }
    }
  }
}
</style>
