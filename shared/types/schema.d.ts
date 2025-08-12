import { account58 } from "~~/server/db/schema";
import * as z from 'zod'
import { createInsertSchema } from 'drizzle-zod'
// 定义分页类型
type Pagination = {
  page: number;     // 当前页码
  pageSize: number; // 每页数量
};
export type Account58 =  Partial<typeof account58.$inferSelect>
export type Account58Page = Account58 & Pagination
// export type Account58Insert = typeof account58.$inferInsert
export type Account58Insert = typeof account58.$inferInsert
export  const Account58InsertSchema = createInsertSchema(account58)
// export type Account58Insert = z.output<
// typeof 
// >

