<script lang="ts" setup>
import { reactive } from "vue";
import Item from "./component/Item.vue";
interface FormData {
  name: string;
  card: {
    main: string;
    customSize: string;
  };
}

const formData = reactive<FormData>({
  name: "",
  card: {
    main: "",
    customSize: "2x2",
  },
});
const onFinish = (values: any) => {
  console.log("Success:", values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};
const config = [
  {
    type: "input",
    label: "应用名称",
    key: "name",
    rules: [{ required: true, message: "必填!" }],
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
const test = () => {};
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
</template>
