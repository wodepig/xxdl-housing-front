import { account58,sysUsers } from "~~/server/db/schema";
import * as z from 'zod'
import { createInsertSchema } from 'drizzle-zod'
// 定义分页类型
type Pagination = {
  page: number;     // 当前页码
  pageSize: number; // 每页数量
};
//  数据库相关的类型
export type Account58 =  Partial<typeof account58.$inferSelect>
export type Account58Page = Account58 & Pagination
// export type Account58Insert = typeof account58.$inferInsert
export type Account58Insert = typeof account58.$inferInsert
export  const Account58InsertSchema = createInsertSchema(account58)
// export type Account58Insert = z.output<
// typeof 
// >


export type SysUser =  Partial<typeof sysUsers.$inferSelect>
export type SysUserPage = SysUser & Pagination
export type SysUserInsert = typeof sysUsers.$inferInsert
export  const SysUserInsertSchema = createInsertSchema(sysUsers)