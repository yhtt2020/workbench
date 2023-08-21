<script lang="ts">
import {mapState} from "pinia";
import {appStore} from "../../store";

export default {
  name: "SendMessageButton",
  props: [
    'uid',
    'enable'
  ],
  emits: [],
  computed: {
    ...mapState(appStore, {
      'myUserInfo': 'userInfo'
    }),
  },
  async mounted() {
    this.$emit('loaded')
  },
  data() {
    return {

    }
  },
  methods: {
    sendMessage() {
      this.$router.push({
        name: 'chat',
        params: {
          action: 'sendMessage',
          uid: String(this.uid)
        }

      })
    }
  }
}
</script>

<template>
  <XtButton @click="sendMessage" :type="enable || enable===undefined?'theme':'default'" style="width:100%">
    <icon icon="message"></icon>
    发消息</XtButton>
</template>

<style scoped lang="scss">

</style>
