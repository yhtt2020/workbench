import { defineAsyncComponent } from "vue";
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
export default {
  async install(app: any) {
    const components = import.meta.glob("./**/index.ts");
    for (const path in components) {
      const component = components[path];
      const name = "Xt" + capitalizeFirstLetter( path.replace("./", "").split("/")[0]);
      app.component(name, defineAsyncComponent(component));
    }
  },
};
