import { folderExists, folderCreate } from "./useFile";
const getFileExtension = (filePath) => {
  const compressedTypes = ["zip", "rar", "7z", "json"];
  const fileExtension = filePath.split(".").pop() || "";
  return compressedTypes.includes(fileExtension);
};

export const useRegisterTTApps = async () => {
  // 1 获取文件
  let path = await tsbApi.dialog.showOpenDialog({
    title: "选择",
    message: "请选择文件",
    multiple: "true",
    properties: ["openFile", "multiSelections"],
  });
  if (!path) return;

  // 2 处理文件类型
  let filePath = path[0]; // 当前文件路径
  if (!getFileExtension(filePath)) {
    const errorInfo = "上传的文件类型错误";
    console.log(errorInfo);
    return errorInfo;
  }

  // 3 处理文件路径
  let temporaryFolderName = "ttapp_test"; // 临时文件夹名称
  // const id = ;
  let folderName = ["ttapp_test", "" + Date.now()]; // 临时文件夹名称
  if (!(await folderExists(folderName))) {
    await folderCreate(folderName);
  }
};
