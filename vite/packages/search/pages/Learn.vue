<template>
  <div style="padding: 20px">
    <a-input-search
      v-model:value="searchWord"
      placeholder="输入文字搜索"
      style="width: 390px;margin-right: 10px"
      @search="onSearch"
    />
    <a-select
      ref="select"
      v-model:value="sampleType"
      style="width: 120px"
      @change="handleChange"
      @focus="focus"
    >
      <a-select-option value="all">全部</a-select-option>
      <a-select-option value="anserws">答案</a-select-option>
      <a-select-option value="classfication">分类</a-select-option>
      <a-select-option value="code">代码</a-select-option>
      <a-select-option value="conversation">表达</a-select-option>
      <a-select-option value="generation">生成</a-select-option>
      <a-select-option value="translation">翻译</a-select-option>
      <a-select-option value="transformation">转换</a-select-option>
    </a-select>

    <div style="margin-top: 15px">
      <a-row :gutter="10">
        <a-col v-for="item in displayItems" :span="12">
          <a-row style="margin-bottom: 10px" @click="this.visible=true;this.currentItem=item">
            <a-col :span="4">
              <a-avatar :src="item.icon" shape="square"></a-avatar>
            </a-col>
            <a-col :span="14">
              <div class="title">
                {{ item.title }}
              </div>
              <div class="summary">
                {{ item.summary }}
              </div>
            </a-col>
          </a-row>

        </a-col>
      </a-row>
      <div style="padding-top: 80px"><a-empty v-if="displayItems.length===0" description="不存在查找的示例"></a-empty></div>
    </div>


  </div>
  <a-modal
    v-model:visible="visible"
    width="100%"
    wrap-class-name="full-modal"
    :footer="null"
  >
    <div>

      <a-row>
        <a-col :span="2">
          <a-avatar :src="currentItem.icon" shape="square"></a-avatar>
        </a-col>
        <a-col>
          <div class="m-title">    {{ currentItem.title }}</div>
          <div class="m-summary">{{ currentItem.summary }}</div>
        </a-col>
      </a-row>


      <div class="prompt">
      <pre>{{currentItem.prompt}}</pre>
      </div>
      <div class="response">

        <pre>{{currentItem.response}}</pre>
      </div>

    </div>
  </a-modal>


</template>

<script lang="ts">

const data = [
  {
    color: 'red',
    icon: '',
    title: '问&答',
    type: ['answers', 'generation', 'conversation'],
    summary: '基于已经存在的知识提问',
    prompt:
      `我是一个高度智能的问答机器人。如果你问我一个植根于真理的问题，我会给你答案。如果你问我一个无稽之谈、诡计多端或没有明确答案的问题，我会回答“未知”。

问：美国的人类预期寿命是多少？
答：美国的人类预期寿命为78岁。

问：1955年谁是美国总统？
答：德怀特·艾森豪威尔于1955年担任美国总统。

问：他属于哪个政党？
答：他属于共和党。

问：香蕉的平方根是多少？
答：未知

问：望远镜是如何工作的？
答：望远镜使用透镜或镜子来聚焦光线并使物体看起来更近。

问：1992年奥运会在哪里举行？
答：1992年奥运会在西班牙巴塞罗那举行。

问：一个邦克有多少只鱿鱼？
答：未知

问：帝王谷在哪里？`,
    response: '帝王谷位于埃及卢克索。'
  },
  {
    color: 'blue',
    icon: '',
    title: '语法纠正',
    type: ['transformation', 'generation'],
    summary: '将语句纠正成标准英语',
    prompt:
      `修正下面的英语语法错误:

She no went to the market.`,
    response: 'She did not go to the market.'
  },
  {
    title: '2年级学生总结',
    type: ['transformation', 'generation'],
    summary: '将复杂文本翻译成更简单的概念',
    prompt:
      `总结一下二年级学生：

木星是距离太阳的第五颗行星，也是太阳系中最大的行星。它是一颗气态巨行星，质量是太阳的千分之一，但是太阳系中所有其他行星总和的两倍半。木星是夜空中肉眼可见的最亮的天体之一，早在有记载的历史之前就为古代文明所知。它以罗马神木星命名。[19]从地球上看，木星的亮度足以使其反射光投射出可见的阴影，[20]并且平均是夜空中仅次于月球和金星的第三亮自然物体。`,
    response: '木星是距离太阳的第五颗行星，非常大而明亮。它可以在夜空中用我们的眼睛看到，自古以来就为人所知。它的名字来自罗马神木星。它通常是夜空中第三亮的物体，仅次于月球和金星。'
  },
  {
    title: '自然语言到OpenAI API',
    summary: '创建代码以使用自然语言指令调用 OpenAI API。',
    type:['code','transformation'],
    prompt: `
    """
Util exposes the following:
util.openai() -> authenticates & returns the openai module, which has the following functions:
openai.Completion.create(
    prompt="<my prompt>", # The prompt to start completing from
    max_tokens=123, # The max number of tokens to generate
    temperature=1.0 # A measure of randomness
    echo=True, # Whether to return the prompt in addition to the generated completion
)
"""
import util
"""
Create an OpenAI completion starting from the prompt "Once upon an AI", no more than 5 tokens. Does not include the prompt.
"""`,
    response: `completion = util.openai().Completion.create(
prompt="Once upon an AI",
max_tokens=5,
temperature=1.0,
echo=False,
)
print(completion)
"""`
  }
]
export default {
  name: 'Learn',
  data () {
    return {
      searchWord:'',
      data,
      visible: false,
      sampleType: 'all',
      currentItem: {}
    }
  },
  mounted () {
    changeHeight(600)
  },
  computed:{
    displayItems(){
      let filteredType=[]
      if(this.sampleType==='all'){
        filteredType=this.data
      }else{
        filteredType=this.data.filter(item=>{
          return item.type.indexOf(this.sampleType)>-1
        })
      }
      if(this.searchWord===''){
        return filteredType
      }
      return filteredType.filter(item=>{
        return Object.keys(item).some(key=>{
          return item[key].indexOf(this.searchWord)>-1
        })
      })
    }
  },
  methods:{
    /**
     * 修改窗体自身高度
     * @param height
     */
    changeHeight(height: number) {
      ipc.send('changeBrowserWindowHeight', height)
    },
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 14px;
  color: #333;
  font-weight: bold;
}

.summary {
  font-size: 13px;
  color: #999
}

.m-title {
  font-size: 16px;
  color: #333;
  font-weight: bold;
  margin-bottom: 5px;
}

.m-summary {
  margin-bottom: 10px;
  font-size: 13px;
  color: #999
}

.prompt {
  max-width: 100%;
  padding: 8px;
  background: #f7f7f8;
  border-radius: 4px;
  margin-bottom: 10px;
}
.prompt pre,.response pre{
  word-wrap: break-word;
  max-width: 100%;
  word-break: break-all;
  white-space: pre-wrap;
  line-height: 20px;
  overflow: hidden !important;
  width: 100%;
}
.response {
  word-wrap: break-word;
  word-break: normal;
  background: #ebfaeb;
  padding: 8px;
  border-radius: 4px;
}
</style>
<style lang="scss">

.full-modal {
  -webkit-app-region:no-drag;
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
    position: absolute;
  }

  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
    overflow-y: auto;
  }

  .ant-modal-body {
    flex: 1;
  }
}
</style>
<style>
body{
  background: white !important;
}
</style>
