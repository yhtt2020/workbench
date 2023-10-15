<template>
  <div class="back-btn no-drag xt-text xt-bg" @click="click">
    <Icon icon="xiangzuo" style="font-size: 2em"></Icon>
  </div>
</template>

<script>
export default {
  name: 'BackBtn',
  props: ['onClick'],
  emits: ['click'],
  mounted () {

  }, methods: {
    click () {
      if (!this.onClick) {
        console.log(this.$route)
        console.log(window.history)
        if (window.history.length > 2) {
          this.$router.go(-1)
        } else {
          this.$router.push({
            name: 'home'
          })
        }
        this.$emit('click')
      } else {
        this.$emit('click')
        //this.onClick()
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
