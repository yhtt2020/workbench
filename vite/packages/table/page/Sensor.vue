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

    if(process.platform==='win32'){
      const readAida64 = window.readAida64
      setInterval(()=>{
        readAida64().then(res => {
          this.data=JSON.stringify(res, null, '\t')
        })
      },1000)
    }

  }
}
</script>

<style scoped>

</style>
