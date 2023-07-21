import { createRouter, createWebHashHistory } from "vue-router";
let routes = [
  {
    path: "/",
    name: "show",
    component: () => import("../views/showTools/index.vue"),
  },
];

const components = import.meta.glob("../views/*/index.vue");
for (const path in components) {
  const name = path.match(/\/views\/(\w+)\/index\.vue/)?.[1];
  console.log('name :>> ', name);
  console.log('path :>> ', path);
  const route = {
    path: "/" + name,
    name: name,
    component: () => import(path),
  };
  routes.push(route);
}
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
