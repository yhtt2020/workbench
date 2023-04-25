<template>

  <div class="m-5">

    <div>
      <SecondPanel :menus="menus">

      </SecondPanel>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>

</template>

<script>
import SecondPanel from '../components/SecondPanel.vue'
export default {
  name: 'Team',
  components: { SecondPanel },
  data(){
    return {
      menus: [
        {
          index: 'hall',
          title: '大厅',
          icon:'team',
          route:
            {
              name: 'hall'
            }
        },
      ],
    }
  }
}
</script>

<style scoped>

</style>
