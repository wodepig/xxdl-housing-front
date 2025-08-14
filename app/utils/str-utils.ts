
export const formatPwd = (str:string):string=>{
    if(!str) return ''
    return str.slice(0, 2) + '****' + str.slice(-2)
}