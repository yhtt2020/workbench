import {
  navObj,
  addCardToNav,
} from "../../../components/card/hooks/addCardToNav";
import { useTransform } from "../src/views/myApps/hooks/useTransform";
import { useFileConversionIcon } from "../../../ui/hooks/useDataConversion";
import { useAddCard } from "../../../ui/hooks/useAddCard";
import { nanoid } from "nanoid";

export const useMenus = (id?: number, item?: any,fn?:Function) => {
  return [{
    label: "添加到桌面",
    newIcon: "fluent:desktop-16-regular",
    callBack: () => {
      if(fn){
        // console.log(item)
        fn(item)
      }
      setTimeout(() => {
        let i = useFileConversionIcon(useTransform(item));
        let id = nanoid(4);
        // console.log(i, useTransform(item), "添加到桌面");
        useAddCard(
          "myIcons",
          {
            iconList:[{...i}]
          },
          id
        )
      },100);
      
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
          if(fn){
            // console.log(item)
            fn(item)
          }
          setTimeout(() => {
            let i = useTransform(item);
            // console.log(i, "主导航");
            addCardToNav(i, "foot");
          }, 100);
          
        },
      },
      {
        label: "左侧导航栏",
        newIcon: "fluent:panel-left-contract-16-regular",
        color: navObj.value.left.state
          ? "var(--primary-text)"
          : "var(--secondary-text)",
        callBack: () => {
          if(fn){
            // console.log(item)
            fn(item)
          }
          setTimeout(() => {
            let i = useTransform(item);
            // console.log("left", "左侧导航栏", i);
            addCardToNav(i, "left");
          }, 100);
          
        },
      },
      {
        label: "右侧导航栏",
        newIcon: "fluent:panel-right-contract-16-regular",
        color: navObj.value.right.state
          ? "var(--primary-text)"
          : "var(--secondary-text)",
        callBack: () => {
          if(fn){
            // console.log(item)
            fn(item)
          }
          setTimeout(() => {
            let i = useTransform(item);
            // console.log("right", "右侧导航栏", i);
            addCardToNav(i, "right");
          }, 100);
          
        },
      },
    ],
  },]
};
