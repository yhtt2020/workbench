<template>
    <div class="w-full h-full">
        <Toolbar style="border-bottom: 1px solid var(--divider);"
            :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />

        <Editor style="height: 100% ; overflow-y: hidden;"
            v-model="valueHtml" :defaultConfig="editorConfig" :mode="mode" @onCreated="handleCreated" />
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, shallowRef, onBeforeUnmount, watch, onMounted } from 'vue'
import { Toolbar, Editor } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { fileUpload } from '../../../../components/card/hooks/imageProcessing'
import { message } from 'ant-design-vue'
import _ from 'lodash-es'
import { yuanCommunityStore } from '../../../../store/yuanCommunity'
const useYuanCommunityStore = yuanCommunityStore()
// wangEditor配置
const editorRef = shallowRef()
// default---wangEditor全部功能  simple---部分功能
const mode = ref('default')
const valueHtml = ref('')
const editorConfig = { placeholder: '正文', MENU_CONF: {} }
const handleCreated = (editor) => {
    editorRef.value = editor; // 记录 editor 实例，重要！
    // 查看所有的功能选项
    // console.log(editor.getAllMenuKeys())
    if (useYuanCommunityStore.saveContent) {
        valueHtml.value = useYuanCommunityStore.saveContent
    }else{
        valueHtml.value = ''
    }
};
const toolbarConfig = ref({
    toolbarKeys: [

        "bold",
        "italic",
        "underline",

        {
            key: "group-text-selcet",
            title: '文本',
            menuKeys: ["headerSelect", "fontSize", "color", "lineHeight", "bgColor", "fontFamily", "through",],
        },
        "|",

        "undo",
        "redo",

        {
            key: 'group-justify',
            title: '对齐',
            menuKeys: ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyJustify', "insertTable", "bulletedList", "numberedList",],
        },
        "|",
        "uploadImage",
        {
            key: "group-more-style",
            title: "更多",
            menuKeys: ["code", "emotion", "insertLink", "fullScreen", "blockquote", "divider",],
        },
        // {
        //     key:"group-font-style",
        //     title:'字体',
        //     menuKeys:["lineHeight","divider","fontSize"],
        // }
        // "fontSize",
        // "lineHeight",


    ],
})
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;
    editor.destroy();
});
const saveText = () => {
    useYuanCommunityStore.saveContent = valueHtml.value
}
// 监听富文本内容
watch(valueHtml, _.debounce(saveText, 500));

editorConfig.MENU_CONF["uploadImage"] = {
    maxFileSize: 10 * 1024 * 1024,

    // 最多可上传几个文件，默认为 10
    maxNumberOfFiles: 10,

    metaWithUrl: false,

    // 跨域是否传递 cookie ，默认为 false
    withCredentials: true,

    // 超时时间，默认为 10 秒
    timeout: 5 * 1000, // 5 秒

    async customUpload(file, insertFn) {
        let url;
        var formData = new FormData();
        formData.append("file", file);
        url = await fileUpload(file)
        if (!url) {
            message.error("图片上传失败");
        } else {
            insertFn(url);
        }
    },
};
editorConfig.MENU_CONF['bgColor'] = {
    colors: ['#333']
}

</script>
<style lang='scss' >
/* 暗色主题 */
html.dark {
    --w-e-textarea-bg-color: #333;
    --w-e-textarea-color: #fff;
    /* ...其他... */
}
:deep(.w-e-text-container) {
    background-color: transparent;
}
</style>