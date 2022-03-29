const globalSearchTempl = /*html*/`
  <div class="gs-wrap" v-show="visible">
    <div class="gs-mask" @click="clkmask"></div>
    <div class="gs-dialog">
      <div class="search flex justify-start align-center">
        <a-icon class="search-lf" type="search"></a-icon>
        <input type="text" class="search-rg" :value="searchWord" @input="searchWord = $event.target.value" style="font-size: 20px" />
      </div>
      <div class="category flex justify-between align-center">
        <div class="category-lf">
          <template v-for="(tag, index) in tags">
            <a-tag :key="index" :color="tag.checked ? '#108ee9' : 'blue'" @click="handleChange(tag, index)">
              {{tag.label}}
            </a-tag>
          </template>
        </div>
        <div class="category-rg flex justify-around align-center">
          <a-icon type="smile" theme="twoTone"></a-icon>
          <div class="flex align-center justify-center">按下Tab键切换类型</div>
        </div>
      </div>
      <div class="content flex align-center justify-center">
        <template v-if="contentLoading">
          <div>
            <a-spin>
              <a-icon slot="indicator" type="loading" style="font-size: 24px" spin></a-icon>
            </a-spin>
          </div>
        </template>
        <ul v-else>
          <template v-for="(item, index) in searchResult">
            <li class="flex justify-between align-center" :key="index">
              <img src="" style="width: 30px; height: 30px;">
              <div class="flex flex-direction justify-center align-start">
                <div>{{item.title}}</div>
                <div>{{item.attached}}</div>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
`

Vue.component("global-search", {
  template: globalSearchTempl,
  props: {
    visible: {
      type: Boolean,
    },
  },
  watch: {
    searchWord(newValue, oldValue) {
      this.contentLoading = true
      console.log(newValue)
    }
  },
  data() {
    return {
      indicator: '<a-icon type="loading" style="font-size: 24px" spin />',
      contentLoading: false,
      searchWord: '',
      tags: [
        {
          label: '全部',
          checked: true
        },
        {
          label: '应用',
          checked: false
        },
        {
          label: '网页',
          checked: false
        },
        {
          label: '标签组',
          checked: false
        }
      ],
      searchResult: []
    };
  },
  methods: {
    clkmask() {
      this.$emit("closeGlobalSearch");
    },
    handleChange(tag, index) {
      this.tags.forEach(e => {
        e.checked = false
      })
      this.tags[index].checked = !tag.checked
    },
    searchApp() {

    },
    searchTask() {

    },
    searchTab() {

    }
  },
  mounted () {
    console.log(tools);
  },
})
