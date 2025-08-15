export async function testReq() {
    return await useHttp.get('/rentbroker/separation/houselist/publishd/community?cateId=11')
}

// 安居客房源列表
export async function houseList() {
    return await useHttp.post('/api/house/list')
}
