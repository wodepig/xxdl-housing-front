// 发送测试请求后的响应体
export interface HomeData {
  alert?: number;
  operatorName?: string;
  companyName?: string;
}
// 保存表单的响应
export interface SaveFormResp {
  code: number; 
  externalCheckCode: number;
  externalCheckReturnMap: Record<string, any>; // 空对象，用Record表示
  houseState: number;
  infoId58: number;
  infoIdAjk: number;
  msg: string;
  unitedHouseId: number;
  url58: string;
}
// 查询房源表单信息
export interface FormDetailQuery {
  cateId: string;
  houseId: string;
}
// 小区信息
export interface Community {
  unityCommunityId?: number;
  unityCommunityName?: string;
}

// 房源信息项类型（原info对象）
export interface HouseDataInfo {
  loading?: boolean, // 刷新状态
  cateId: number; // 分类ID
  title: string; // 标题
  communityId: number; // 小区ID
  communityName: string; // 小区名称
  area: string; // 面积
  shi: number; // 室数量
  ting: number; // 厅数量
  wei: number; // 卫数量
  floor: number; // 楼层
  price: string; // 价格
  allPicNums: number; // 所有图片数量
  shineiPicNums: number; // 室内图片数量
  unityInfoId: string; // 统一信息ID
  ajkInfoId: number; // 安居客信息ID
  wubaInfoId: number; // 58同城信息ID
  ganjiInfoId: number; // 赶集网信息ID
  picUrl: string; // 图片URL
  editUrl: string; // 编辑URL
  muitiImageIsShow: number; // 多图是否显示（1表示显示）
  leftTime: number; // 剩余时间
  extend: {
    fromUserCenter: string; // 是否来自用户中心
    gongyugongquid: string; // 公寓ID
    state: string; // 状态
  };
}

// 响应数据主体类型（原data对象）
export interface HouseData {
  normalFangYuanCount: number; // 正常房源数量
  errorFangYuanCount: number; // 错误房源数量
  draftFangYuanCount: number; // 草稿房源数量
  recordCount: number; // 记录总数
  pageIndex: number; // 当前页码
  pageSize: number; // 每页大小
  lastPage: boolean; // 是否为最后一页
  shortcut: number; // 快捷方式标识
  bindPlatform: string; // 绑定的平台
  infos: HouseDataInfo[]; // 房源信息数组（使用上面定义的HouseInfo类型）
  defaultList: boolean; // 是否为默认列表
  dspFangYuanCount: number; // DSP房源数量
}
// 查询参数类型定义
export interface HouseDataQuery {
  searchAction?: string;
  bt?: string;          // 房源标题
  xq?: string;          // 小区ID，这里是字符串形式的数字
  shidiheyan?: string;  // 实地核验状态，-1表示未筛选
  zfhy?: string;        // 租房合约状态，-1表示未筛选
  pageIndex?: number;   // 页码，字符串形式的数字
  pageSize?: number;    // 每页条数，字符串形式的数字
  px?: string;          // 排序方式，updatedesc表示按更新时间降序
}

// 安居客API响应类型
export interface AJKApiResponse<T> {
  status?: "ok" | string; // 状态，至少包含"ok"
  errcode?: number,
  code?: number; // 状态码
  message?: string; // 消息
  data?: T; // 数据主体
}

