<template>
<textarea style="width: 100%" v-html="data"></textarea>
</template>

<script>
export default {
  name: 'Sensor',
  data () {
    return {
      data: ''
    }
  },
  mounted () {

    const readAida64 = require('aida64-to-json')
    setInterval(()=>{
      readAida64().then(res => {
        this.data=JSON.stringify(res, null, '\t')
      })
    },1000)
  }
}
</script>

<style scoped>

</style>
