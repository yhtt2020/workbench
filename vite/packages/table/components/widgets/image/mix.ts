import { mapWritableState } from "pinia";
import { image } from "./image";
export default {
  computed: {
    ...mapWritableState(image, ["edit"]),
  },
};
