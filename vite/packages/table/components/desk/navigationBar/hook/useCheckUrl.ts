import { useToast } from 'vue-toastification'
import { getFavicon } from './getUrlName';
import { useLinkConversionNav } from '../../../../ui/hooks/useDataConversion';

type icon = {
    faviconURL: string;
    pageTitle: string;
}
export const isValidUrl = (string) => {
    // 简化的 URL 正则表达式检查
    let regex = /^(https?:\/\/)?[\w.-]+\.[\w\.-]+/;
    const result = regex.test(string);
    console.log(result);
    if (!result) {
      useToast().error('无效的URL');
      return false;
    }
    return true;
};


export const linkDrop = async (url) => {
    if(!url.match(/^(http:\/\/|https:\/\/)/)){
        url = 'http://' + url;
    }
    if(isValidUrl(url)){
        const icon : icon = await getFavicon(url).catch(error => console.error("Failed to get favicon:", error));
        const target = { name: icon.pageTitle, icon: icon.faviconURL, value: url };
        const file = useLinkConversionNav(target);
        return file
    }
}


// const handleLinkDrop = async (dragEvent, currentX) => {
//     let link = dragEvent.dataTransfer.getData('text/plain');
  
//     if (link && link !== '') {
//       // 确保链接以 http:// 或 https:// 开头
//       if (!link.match(/^(http:\/\/|https:\/\/)/)) {
//         link = 'http://' + link;
//       }
  
//       if (isValidUrl(link)) {
//         const linkIcon = await getFavicon(link).catch(error => console.error("Failed to get favicon:", error));
//         const target = { name: linkIcon.pageTitle, icon: linkIcon.faviconURL, value: link };
  
//         const file = useLinkConversionNav(target);
//         emit('createFile', file, currentX);
//       }
//     }
//   };
