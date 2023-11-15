import { fileUpload } from '../../../../components/card/hooks/imageProcessing'
// 
export const translateImage=(fileList)=>{
    return Promise.all(fileList.map(async (file)=>{
        return await fileUpload(file.originFileObj);
    }))
}
// export const options={
    
//         publishType:[
//             {
//                 title: '发动态',
//                 value: 'dynamic'
//             },
//             {
//                 title: '发帖子',
//                 value: 'post'
//             },
//         ],
//         defaultType:{ 'title': '发动态', 'value': 'dynamic' },
//         isRightBtn:true,
//         rightBtn:{
//             fullScreenVisible:true,
//             closeVisible:true
//         },
//         footerButtonVisible:true,
//         footerButton:{
//             emojiVisible:true,
//             pictureVisible:true
//         },
//         isFooter:true,
//         footerSelect:true,
//         footerOptions:{

//         },
//         cascaderValue:{},
//         footerClose:true,
//         footerSubmit:true,
//         functionButtons:{
//             close:'取消',
//             submit:'发布',
//         }




    
// }