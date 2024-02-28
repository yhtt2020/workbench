/// <reference types="vite/client" />

import XtOptionInfo from "./optionInfo";

declare module "vue" {
  export interface GlobalComponents {
    XtOptionInfo: typeof import("./optionInfo").default;
  }
}
