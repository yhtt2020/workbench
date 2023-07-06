import { sizeList, linkList, imgSteteList } from "../components/edit";
export default {
  props: {
    isRadius: { type: Boolean },
    radius: { type: Number },

    titleValue: { type: String },
    link: { type: String },
    linkValue: {},
    size: { type: String, default: sizeList[0].value },
    open: {
      default: () => {
        return {
          value: "",
          type: linkList[0].value,
        };
      },
    },
    src: { type: String },
    imgState: {
      type: String,
      default: imgSteteList[0].value,
    },
    isBackground: { type: Boolean },
    backgroundColor: { type: String },
    backgroundIndex: { type: Number },
  },
};
