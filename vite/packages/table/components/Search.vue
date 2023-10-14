<template>
  <div class="flex items-center">
    <div>
      <a-input allow-clear @keydown.enter="doSearch" :modelValue="keywordsData" @change="changeInput($event)" :placeholder="placeholder" spellcheck="false"
               class="no-drag input" :style="inputStyle">
        <template #prefix>
          <Icon v-if="isSearchIcon" icon="sousuo" class="mr-2" style="color: var(--disable-text) !important;"></Icon>
        </template>
      </a-input>
    </div>
    <div class="ml-3" v-if="isFiltrate && showSort">
      <a-select :style="selectStyle"
                @change="changeSelect($event)"
                class="select rounded-lg  s-item flex items-center text-center" size="large" :bordered="false"
                v-model:value="orderData"
                :dropdownStyle="{ 'z-index': 999999999999, backgroundColor: 'var(--mask-bg)' }">
        <a-select-option class="no-drag" v-for="item in sortType" :value="item.value" :key="item">{{
            item.name
          }}
        </a-select-option>
      </a-select>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 搜索值
    keywords: {
      type: String,
      default: '',
    },
    showSort:{
      type:Boolean,
      default:true,
    },
    //下拉的选中值
    order: {
      type: String,
      default: '',
    },
    // 搜索的提示
    placeholder: {
      type: String,
      default: '关键词',
    },
    // 搜索输入框样式
    inputStyle: {
      type: String,
      default: '',
    },
    // 是否显示搜索按钮
    isSearchIcon: {
      type: Boolean,
      default: true,
    },
    // 是否显示下拉列表
    isFiltrate: {
      type: Boolean,
      default: false,
    },
    // 选择下拉的样式
    selectStyle: {
      type: String,
      default: '',
    },
    //下拉的排序类型
    sortType: {
      type: Array,
      default: []
    },

  },
  mounted () {
    this.keywordsData=this.keywords
    this.orderData=this.order
  },
  data () {
    return {
      keywordsData:'',
      orderData:'',
      selectValue: ''
    }
  },
  watch: {
    keywords(newVal){
      this.keywordsData=newVal
    },
    defaultSelect: {
      immediate: true,
      handler (newValue, oldValue) {
        if (newValue != oldValue) {
          this.selectValue = this.defaultSelect
        }
      }
    }
  },
  methods: {
    doSearch(){
      this.$emit('search')
    },

    //下拉值改变
    changeSelect (event) {
      this.$emit('update:order', event)
      this.$emit('search')
    },
    //输入框值改变
    changeInput (event) {
      this.$emit('update:keywords', event.target.value)
    }
  }
}
</script>

<style lang="scss" scoped>
.input {
  width: 320px;
  height: 48px;
  background: var(--mask-bg);
  border-radius: 12px;
  font-size: 18px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.select {
  width: 134px;
  height: 48px;
  color: var(--primary-text);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 16px;
  background: var(--mask-bg);
}
</style>
