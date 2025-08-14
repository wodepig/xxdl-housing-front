
/**
 * 延迟指定时间的函数
 * @param ms 延迟的毫秒数
 * @returns Promise<void> 延迟结束后resolve
 */
export const sleep =(ms: number): Promise<void> =>{
  return new Promise(resolve => {
    // 使用setTimeout实现延迟，延迟结束后调用resolve
    setTimeout(resolve, ms);
  });
}
/**
 * 获取uuid
 * @param replace 是否替换-
 * @returns 
 */
export const getUUID = (replace: boolean=false) => {
    let uuid = window.crypto.randomUUID()
    return  replace ? uuid.replaceAll('-', '') : uuid
}