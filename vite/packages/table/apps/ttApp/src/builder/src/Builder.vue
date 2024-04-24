<script lang="ts" setup>
import { reactive, ref } from "vue";
import Item from "./component/Item.vue";
import { message } from "ant-design-vue";
import {  useSelectAll } from "../../hooks";
import { useTTAppStore } from "../../store";
import { storeToRefs } from "pinia";
const ttappStore: any = useTTAppStore();

const { ttappList } = storeToRefs(ttappStore);

const formData = reactive<any>({
  name: "",
  description: "",
  logo: "",
  preview: "",
  card: {
    entry: "",
    customSize: "2x2",
    name: "",
  },
});
const onFinish = async (values: any) => {
  console.log("Succes11111111111s:", values);
  let data = {
    name: formData.name,
    description: formData.description,
    logo: formData.logo,
    preview: formData.preview,
    modules: {
      card: formData.card,
    },
  };
  let dataJson = JSON.stringify(data);
  tsbApi.ttapp.installJson(dataJson, (data) => {
    if (data.code === 200) {
      message.success("安装成功");
      ttappStore.selectAll();
    } else {
      message.error("安装失败");
    }
  });
};

const onFinishFailed = (errorInfo: any) => {
  // console.log("Failed:", errorInfo);
};
const id = ref("");

// 表单显示状态
const formVisible = ref(false);

const installTTApp = async () => {
  // let res = await useInstallTTApp();
  console.log("res :>> ", res);
  // 安装成功
  if (res.code === 200) {
    message.success("安装成功");
    ttappStore.selectAll();
  }
  // manifest.json失败
  else if (res.code > 20 && res.code < 30) {
    formVisible.value = true;
    message.error("manifest.json错误，请重新配置");
  }
  // 其他失败
  else {
    message.error("文件上传失败请重试");
  }
  console.log("res :>> ", res);
};

const config = [
  {
    type: "input",
    label: "应用名称",
    key: "name",
    rules: [{ required: true, message: "必填!" }],
  },
  {
    type: "input",
    label: "描述",
    key: "description",
    rules: [{ required: true, message: "必填!" }],
  },
  {
    type: "input",
    label: "logo",
    key: "logo",
    rules: [{ required: true, message: "必填!" }],
  },
  {
    type: "input",
    label: "预览图",
    key: "preview",
    rules: [{ required: true, message: "必填!" }],
  },
  {
    type: "object",
    key: "card",
    children: [
      {
        type: "input",
        label: "组件名",
        key: "name",
        rules: [{ required: true, message: "必填!" }],
      },
      {
        type: "input",
        label: "入口",
        key: "entry",
        rules: [{ required: true, message: "必填!" }],
      },
      {
        type: "input",
        label: "大小",
        key: "customSize",
        rules: [{ required: true, message: "必填!" }],
      },
    ],
  },
];
</script>
<template>
  <a-form
    v-if="formVisible"
    :model="formData"
    name="basic"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    autocomplete="off"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
  >
    <!-- 循环表单配置 -->
    <template v-for="item in config">
      <!-- 循环二级 -->

      <!-- -->
      <template v-if="item?.children">
        <template v-for="i in item.children">
          <a-form-item
            :label="i.label"
            :name="[item.key, i.key]"
            :rules="i.rules"
          >
            <Item
              v-model="formData[item.key][i.key]"
              v-bind="i"
              :key="[item.key][i.key]"
            /> </a-form-item
        ></template>
      </template>
      <a-form-item
        v-else
        :label="item.label"
        :name="item.key"
        :rules="item.rules"
      >
        <Item v-model="formData[item.key]" v-bind="item" />
      </a-form-item>
    </template>

    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
      <a-button type="primary" html-type="submit">Submit</a-button>
    </a-form-item>
  </a-form>

  <xt-button @click="installTTApp()" :w="140" :h="40" type="theme"
    >安装TTApp1</xt-button
  >
</template>
