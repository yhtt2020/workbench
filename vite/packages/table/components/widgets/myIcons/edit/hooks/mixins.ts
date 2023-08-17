
import { mapWritableState } from "pinia";
import { myIcons } from "../../../../../store/myIcons";
export default {
  computed: {
    ...mapWritableState(myIcons, ["edit"]),
  },
};
