<template>
  <DeskGroup :desk-list="deskList"></DeskGroup>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import DeskGroup from "../../components/desk/DeskGroup.vue";
import {mapWritableState} from "pinia";
import {workStore} from "../../store/work";

export default ({
  name: "Desk",
  components: {DeskGroup},
  computed:{
    ...mapWritableState(workStore,['deskList'])
  }
})
</script>



<style scoped lang="scss">

</style>
