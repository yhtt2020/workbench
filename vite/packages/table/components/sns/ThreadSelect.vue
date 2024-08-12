<script lang="ts">
import {defineComponent} from 'vue'
import Select from "../widgets/communityContent/Select.vue";

export default defineComponent({
  name: "ThreadSelect",
  components: {Select},
  emits:['changed'],
  props:['value'],
  data(){
    return {
      list:[],
      threadIds:{}
    }
  },methods:{
    getSearch(){
      console.log('正在修改')
      this.list=[{id:1,name:'123'},{id:2,name:'1233'}]
    }
  }

})
</script>

<template>
  <Select
    v-model:multiple="threadIds"
    :list="list"
    @cb="getSearch">
  </Select>
</template>

<style scoped lang="scss">

</style>
