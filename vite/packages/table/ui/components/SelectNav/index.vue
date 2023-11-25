<template>
 <div class="flex">
  <div :style="{width:`${lw}px`}" class="flex flex-col left-content">
   <div class="flex items-center pointer justify-center mb-3"
    v-for="(navItem,index) in navList" :class="{'select-border':selectItem.name === navItem.name}"
   >
    <div :style="{width:`${cw}px`,height:`${h}px`}" :class="{'xt-bg-2 xt-text':selectItem.name === navItem.name}" 
     class="flex items-center justify-center rounded-md font-16 font-400" @click="callback(navItem)" style="color:var(--secondary-text);"
    >
     {{ navItem.cname }}
    </div>
   </div>
  </div>
  <div class="right-content h-full">
   <slot></slot>
  </div>
 </div>
</template>

<script>
 export default {
  props:{
   navList:{
    type:Array,
    default:()=>[]
   },
   lw:{
    type:String,
    default:'128',
   },
   selectItem:{
    type:Object,
    default:()=>{}
   },
   h:{
    type:String,
    default:'40'
   },
   enableRoute:{
    type:Boolean,
    default:false,
   },
   cw:{
    type:String,
    default:'96'
   }
  },
  methods:{
   callback(item,index){
    this.$emit('update:selectItem',item)
    if(this.enableRoute){
     this.$router.push(item.route)
    }
   }
  }
 }
</script>

<style lang="scss" scoped>
.left-content{
 border-right: 1px solid rgba(255, 255, 255, 0.1);
 height: 100%;
}
.select-border{
 border-right: 1px rgba(22, 119, 255, 1) solid !important;
}
</style>