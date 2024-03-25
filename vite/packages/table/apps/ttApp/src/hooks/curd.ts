type Res = {
  code: number;
  data: any;
};

/**
 * 查询一条数据
 */
export const useSelect = async (id: string) => {
  const res: Res = await new Promise((reject) => {
    tsbApi.ttapp.select(id, (data) => {
      reject(data);
    });
  });
  if (res.code !== 200) {
    return false;
  }
  return res.data;
};
/**
 * 查询所有数据
 */
export const useSelectAll = async () => {
  const res: Res = await new Promise((reject) => {
    tsbApi.ttapp.selectAll((data) => {
      reject(data);
    });
  });
  if (res.code !== 200) {
    return [];
  }
  return res.data;
};
/**
 * 删除一条数据
 */
export const useUninstall = async (id: string) => {
  const res: Res = await new Promise((reject) => {
    tsbApi.ttapp.uninstall(id, (data) => {
      reject(data);
    });
  });
  if (res.code !== 200) {
    return false;
  }
  return true;
};
