import Title from "../components/Title.vue";

import { mapWritableState } from "pinia";
import { myIcons } from "../../../../../store/myIcons";
export default {
  components: { Title },
  computed: {
    ...mapWritableState(myIcons, ["edit"]),
  },
};
