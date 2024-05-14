import AI from "../../../../page/AIAssistant/index.vue";

const componentList: any = {
  AI,
};

export const getComponent = (componentName: string) => {
  return componentList[componentName];
};
