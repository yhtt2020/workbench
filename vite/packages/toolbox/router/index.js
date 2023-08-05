import { createRouter, createWebHashHistory } from "vue-router";

import { defineAsyncComponent } from "vue";

let routes = [
  {
    path: "/",
    name: "main",
    component: () => import("../views/main/tools.vue"),
  },
];

const components = import.meta.glob(
  "/packages/toolbox/views/tools/*/index.vue"
);
Object.entries(components).forEach((item) => {
  const name = item[0].match(/\/tools\/(\w+)\/index\.vue/)?.[1];
  const route = {
    path: "/" + name,
    name: name,
    component: defineAsyncComponent(item[1]),
  };
  routes.push(route);
});

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
