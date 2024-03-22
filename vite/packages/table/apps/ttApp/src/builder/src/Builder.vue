<script lang="ts" setup>
import { reactive, ref } from "vue";
import Item from "./component/Item.vue";
import { useInstallTTApp } from "../../hooks";
interface FormData {
  name: string;
  description: string;
  card: {
    main: string;
    customSize: string;
  };
}

const formData = reactive<FormData>({
  name: "",
  description: "",
  card: {
    main: "",
    customSize: "2x2",
  },
});
const onFinish = (values: any) => {
  console.log("Success:", values);
  let data = {
    name: formData.name,
    description: formData.description,
    modules: {
      card: formData.card,
    },
  };
  let dataJson = JSON.stringify(data);
  console.log("data.value :>> ", dataJson);
  tsbApi.ttapp.writeJson(id.value, data);
};

const onFinishFailed = (errorInfo: any) => {
  // console.log("Failed:", errorInfo);
};
const id = ref("");
const installTTApp = async () => {
  let res = await useInstallTTApp();
  id.value = res;
  console.log("res :>> ", res);
};

const a = () => {
  tsbApi.ttapp.completeInstall(id.value, (res) => {
    console.log("res :>> ", res);
  });
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
  },
  {
    type: "object",
    key: "card",
    children: [
      {
        type: "input",
        label: "入口",
        key: "main",
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
  {{ formData }}
  <a-form
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

  {{ id }}
  <xt-button @click="a()" :w="140" :h="40" type="theme">合并</xt-button>
  <xt-button @click="installTTApp()" :w="140" :h="40" type="theme"
    >安装TTApp</xt-button
  >
</template>
