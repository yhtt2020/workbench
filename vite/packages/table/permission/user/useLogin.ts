import { h, render } from "vue";
import Login from "./Login.vue";

export default Login;
export const useLogin = (cb?) => {
  // 3 把渲染的 vNode 移除
  const close = () => {
    render(null, document.body);
  };

  // 1 生成 vNode
  const vNode = h(Login, {
    close,
    cb
  });

  // 2 render 渲染
  // 先卸载之前的组件
  render(null, document.body);
  // 再渲染新的组件
  let component = render(vNode, document.body);
  return {
    component,
    close,
  };
};
