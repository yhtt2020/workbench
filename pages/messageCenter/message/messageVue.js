new Vue({
  el: "#message",
  methods: {
    openMsmSetting() {
      ipc.send('openMsmSetting')
    }
  }
});
