import { createRouter, createWebHashHistory } from "vue-router";
let routes = [
  {
    path: "/",
    name: "main",
    component: () => import("../views/main/tools.vue"),
  },
];

const components = import.meta.glob("../views/tools/*/index.vue");
let a =  Object.entries(components)
for (const path in components) {
  const name = path.match(/\/views\/tools\/(\w+)\/index\.vue/)?.[1];
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
