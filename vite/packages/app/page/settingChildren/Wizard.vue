<template>
  <h3>开发向导

  </h3>

</template>

<script>
import { mapWritableState, mapActions } from 'pinia'
import { appStore } from '../../store'
import { CodeTwoTone } from '@ant-design/icons-vue'

export default {
  name: 'develop',
  components: {
    CodeTwoTone
  },
  computed: {
    ...mapWritableState(appStore, ['app', 'debugMod'])
  },
  methods: {
    ...mapActions(appStore, ['toggleDebug'])
  }
}
</script>

<style scoped>

</style>
