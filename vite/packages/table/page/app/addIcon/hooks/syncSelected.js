import Icon from "../components/Icon.vue";
export default {
  components: { Icon },
  data() {
    return {
      selectApps: [],
    };
  },
  methods: {
    updateSelectApps(selectApps) {
      this.selectApps = selectApps;
      this.$emit("updateData",selectApps)
    },
  },

};
