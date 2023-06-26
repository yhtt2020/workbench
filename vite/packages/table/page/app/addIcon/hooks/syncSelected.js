import Icon from "../components/icon.vue";
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
    },
  },

};
