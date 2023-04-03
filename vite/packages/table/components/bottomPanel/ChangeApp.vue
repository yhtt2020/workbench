<template>
<div class="w-80 flex flex-row absolute bottom-4 left-1/2 -translate-x-1/2">
  <div style="width: 56px;height: 56px" class="flex justify-center items-center" v-for="item in listData">
    <Icon :icon="item.icon" style="width: 32px;height: 32px;color:white;" class="pointer" @click.stop="clickListItem(item)"></Icon>
  </div>
</div>
</template>

<script>
export default {
  name: "ChangeApp",
  props:{
    full:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return {
      listData:[
        {
          icon:'lock',
          name:'锁定屏幕',
          fn:()=>{this.$router.push({ path: '/lock' })}
        },
        {
          icon:'laptop',
          name:'设备设置',
          fn:()=>{
            if (this.$route.path === '/status') {
              this.$router.go(-1)
            } else {
              this.$router.push({ path: '/status' })
            }}
        },
        {
          icon:'fullscreen',
          name:'全屏显示',
          fn:()=>{
            if (this.full) {
              this.$emit('setFull',false)
              tsbApi.window.setFullScreen(false)
            } else {
              this.$emit('setFull',true)
              tsbApi.window.setFullScreen(true)
            }}
        },
        {
          icon:'setting',
          name:'基础设置',
          fn:()=>{  this.$router.push({ name: 'setting' })}
        },
        {
          icon:'tuichu',
          name:'电源',
          fn:()=>{
            this.$router.push({ path: '/power' })}
        }
      ]
    }
  },
  methods:{
    clickListItem(item){
        item.fn();
        this.$emit('closeChangeApp')
    }
  }
}
</script>

<style scoped>

</style>
