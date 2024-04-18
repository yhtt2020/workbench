/**
 * 更新配置文件
 */
export const updateConfig = async (id: any) => {
  let path = await tsbApi.dialog.showOpenDialog({
    title: "选择",
    message: "请选择文件",
    multiple: "true",
    properties: ["openFile", "multiSelections"],
    filters: [
      {
        name: "压缩文件",
        extensions: ["zip"],
      },
    ],
  });

  if (!path[0]) return;

  return await new Promise((resolve) => {
    tsbApi.ttapp.installV2(
      {
        path: path[0],
        id,
      },
      (data) => {
        resolve(data);
      }
    );
  });
};
