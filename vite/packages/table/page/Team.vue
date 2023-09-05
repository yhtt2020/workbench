<template>

  <div class="p-3 flex" style="height: 100%;display: flex;">

<!--    <div>-->
<!--      <SecondPanel :menus="menus">-->

<!--      </SecondPanel>-->
<!--    </div>-->
    <div class="ml-10" style="flex: 1;height: 100%;display: flex;flex-direction: column;">
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
  },methods:{

  },async mounted () {

  }
}
</script>

<style scoped>

</style>
