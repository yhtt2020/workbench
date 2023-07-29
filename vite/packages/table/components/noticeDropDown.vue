<template>
 <a-dropdown trigger="click">
    <div class="w-6 h-6 p-1 flex items-center active-button pointer rounded-md justify-center" style="background: var(--secondary-bg);">
      <Icon icon="gengduo1" style="font-size: 1.5em;"></Icon>
    </div>
    <template #overlay>
      <a-menu class="custom-dropdown-menu flex-col flex items-center justify-center" style="background: var(--secondary-bg);">
        <a-menu-item style="color: var(--secondary-text);" v-for="(item,index) in dropList" @click="">
          {{ item.title }}
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script>
export default {
  data(){
    return{
      dropList:[{title:'打开应用'},{title:'全部清理'}],
    }
  },
  methods:{

  }
}
</script>

<style lang="scss" scoped>
.custom-dropdown-menu{
  border-radius: 10px !important;
  background-color:var(--secondary-bg) !important;
  box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.5);
  width: 120px;
}
</style>