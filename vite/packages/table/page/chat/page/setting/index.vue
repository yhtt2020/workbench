<template>
 <div class="w-full p-4 xt-text-2">
  <xt-selectNav :navList="classNav" lw="128" v-model:selectItem="classItem" :enableRoute="true">
    <div class="w-full px-4">
      <router-view />
    </div>
  </xt-selectNav>
 </div>
</template>

<script>
export default {
 props:['no'],

 data(){
  return{
    classNav:[
     {
      name:'community',cname:'社群设置',
      route:{
        name:'communitySettings',
      }
     },
     {
      name:'member',cname:'成员管理',
      route:{
       name:'member'
      }
     },
     {
      name:'role',cname:'角色权限',
      route:{
       name:'role'
      }
     },
     {
      name:'more',cname:'更多设置',
      route:{
       name:'more'
      }
     },
    ],
    classItem:{ 
      name:'community',cname:'社群设置',
      route:{
        name:'communitySettings',
      }
    }
  }
 },

 mounted() {  
  this.$nextTick(()=>{
    if(this.$route.meta.tab4 === undefined){
      const data = this.classNav[0]
      const route = data.route
      this.$router.push(route)
    }else{
      const routeName = this.$route.name
      const findRoute = this.classNav.find((item)=>{
        return item.route.name === routeName
      })
      this.classItem = findRoute
      this.$router.push(findRoute.route)
    }
  })
 },
};
</script>

<style lang="scss" scoped>
</style>