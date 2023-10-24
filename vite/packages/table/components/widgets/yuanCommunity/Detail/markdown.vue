<template>
    <div class="w-full h-full" >
        <Toolbar style="border-bottom: 1px solid var(--divider);background-color: var(--primary-bg) !important;" :editor="editorRef" :defaultConfig="toolbarConfig"
            :mode="mode" />

        <Editor style="height: 100% ; overflow-y: hidden;background-color: var(--primary-bg) !important;" v-model="valueHtml"
            :defaultConfig="editorConfig" :mode="mode" @onCreated="handleCreated" />
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, shallowRef, onBeforeUnmount } from 'vue'
import { Toolbar, Editor } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import {fileUpload} from '../../../../components/card/hooks/imageProcessing'
import {message} from 'ant-design-vue'
// wangEditor配置
const editorRef = shallowRef()
// default---wangEditor全部功能  simple---部分功能
const mode = ref('default')
const valueHtml = ref('')
const editorConfig = { placeholder: '正文', MENU_CONF: {} }
const handleCreated = (editor) => {
    editorRef.value = editor; // 记录 editor 实例，重要！
    
    // 查看所有的功能选项
    console.log(editor.getAllMenuKeys())
};
const toolbarConfig = ref({
    toolbarKeys: [
        
        "bold",
        "italic",
        "underline",
        "divider",
        "through",
        {
            key:"group-text-selcet",
            title:'文本',
            menuKeys:["headerSelect","fontSize","color","lineHeight","bgColor","fontFamily","blockquote"],
        },
        "|",
        "bulletedList",
        "numberedList",
        "undo",
        "redo",
        "insertTable",
        
        {
            key:'group-justify',
            title:'对齐',
            menuKeys:['justifyLeft','justifyCenter','justifyRight','justifyJustify',],
        },
        "|",
        "uploadImage",
        {
            key: "group-more-style",
            title: "更多",
            menuKeys: ["code", "emotion", "insertLink","fullScreen",],
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
editorConfig.MENU_CONF['bgColor']={
    colors:['#333']
}

</script>
<style lang='scss' scoped>
.w-e-toolbar{
    background-color: var(--secondary-bg ) !important;
}
.w-e-textarea{
    background-color: var(--secondary-bg ) !important;
}

</style>