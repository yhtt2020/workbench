import {
  navObj,
  addCardToNav,
} from "../../../components/card/hooks/addCardToNav";
import { useTransform } from "../src/views/myApps/hooks/useTransform";
import { useFileConversionIcon } from "../../../ui/hooks/useDataConversion";
import { useAddCard } from "../../../ui/hooks/useAddCard";
import { nanoid } from "nanoid";

export const useMenus = (id?: number, item?: any) => {
  return {
    label: "添加到",
    newIcon: "fluent:add-16-regular",
    id: id,
    children: [
      {
        label: "添加到桌面",
        newIcon: "fluent:desktop-16-regular",
        callBack: () => {
          let i = useFileConversionIcon(useTransform(item));
          let id = nanoid(4);
          // console.log(i, "添加到桌面");
          useAddCard(
            "myIcons",
            {
              iconList:[{...i}]
            },
            id
          )
        },
      },
      {
        label: "添加到导航栏",
        newIcon: "fluent:tablet-16-regular",
        children: [
          {
            label: "主导航",
            newIcon: "fluent:tablet-16-regular",
            color: navObj.value.foot.state
              ? "var(--primary-text)"
              : "var(--secondary-text)",
            callBack: () => {
              let i = useTransform(item);
              // console.log(i, "主导航");
              addCardToNav(i, "foot");
            },
          },
          {
            label: "左侧导航栏",
            newIcon: "fluent:panel-left-contract-16-regular",
            color: navObj.value.left.state
              ? "var(--primary-text)"
              : "var(--secondary-text)",
            callBack: () => {
              let i = useTransform(item);
              // console.log("left", "左侧导航栏", i);
              addCardToNav(i, "left");
            },
          },
          {
            label: "右侧导航栏",
            newIcon: "fluent:panel-right-contract-16-regular",
            color: navObj.value.right.state
              ? "var(--primary-text)"
              : "var(--secondary-text)",
            callBack: () => {
              let i = useTransform(item);
              // console.log("right", "右侧导航栏", i);
              addCardToNav(i, "right");
            },
          },
        ],
      },
    ],
  };
};
