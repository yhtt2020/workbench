import { fileUpload } from '../../../../components/card/hooks/imageProcessing'
// 
export const translateImage=(fileList)=>{
    return Promise.all(fileList.map(async (file)=>{
        return await fileUpload(file.originFileObj);
    }))
}