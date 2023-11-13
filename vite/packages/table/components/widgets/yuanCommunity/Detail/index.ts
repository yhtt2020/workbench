import { fileUpload } from '../../../../components/card/hooks/imageProcessing'
// 
export const translateImage=(fileList)=>{
    return Promise.all(fileList.map(async (file)=>{
        return await fileUpload(file.originFileObj);
    }))
}
export const options={
    header:{
        publishType:[
            {
                title: '发动态',
                value: 'dynamic'
            },
            {
                title: '发帖子',
                value: 'post'
            },
        ],
        defaultType:{ 'title': '发动态', 'value': 'dynamic' },
        isRightBtn:true,
        

    }
}