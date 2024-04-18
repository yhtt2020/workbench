<script setup lang="ts">

import { useTTAppStore } from "../../../../../ttApp/src/store";
import { storeToRefs } from "pinia";
import {
  defaultData,
  useFileConversionIcon,
} from "../../../../../../ui/hooks/useDataConversion";
// const ttappStore: any = useTTAppStore(); 
// const { ttappList, ttappData } = storeToRefs(ttappStore);
import { installV2 } from "./installV2";
</script>

<template>
  <xt-button type="theme" w="95" h="32" radius="8" @click="installV2">
    导入应用
  </xt-button>
</template>
<style lang="scss" scoped></style>
