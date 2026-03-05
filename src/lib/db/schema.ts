import { foreignKey } from "drizzle-orm/gel-core";
import { pgTable, timestamp, uuid, text,uniqueIndex } from "drizzle-orm/pg-core";
import { table } from "node:console";
import { ref, title } from "node:process";
import { db } from ".";

 export const users=pgTable( "users",{
    id:uuid("id").primaryKey().defaultRandom().notNull(),
    created_at:timestamp("created_at").notNull().defaultNow(),
    updated_at:timestamp("updated_at").notNull().defaultNow().
    $onUpdate(() => new Date()),
      name: text("name").notNull().unique(),

})
export const feeds=pgTable("feeds",{
  id:uuid("id").primaryKey().defaultRandom().notNull(),
    created_at:timestamp("created_at").notNull().defaultNow(),
    updated_at:timestamp("updated_at").notNull().defaultNow().
    $onUpdate(() => new Date()),
    name:text("name").notNull(),
    last_fetched_at:timestamp("last_fetched_at"),
    url:text("url").notNull().unique(),
    user_id: uuid("user_id").references(()=>
    users.id,{onDelete: "cascade" }),
})
export const feed_follows=pgTable("feed_follows",{
   id:uuid("id").primaryKey().defaultRandom().notNull(),
   created_at:timestamp("created_at").notNull().defaultNow(),
    updated_at:timestamp("updated_at").notNull().defaultNow().
    $onUpdate(() => new Date()),
    user_id :uuid("user_id").notNull().references(()=>
    users.id,{onDelete : "cascade"}),
    
    feed_id:uuid("feed_id").notNull().references(()=>
    feeds.id,{onDelete:"cascade"}),
     
 } ,(table)=>({
user_feed_unique:uniqueIndex("user_feed_unique").on(table.user_id,table.feed_id) }))
export const posts=pgTable("posts",{
   id:uuid("id").primaryKey().defaultRandom().notNull(),
   created_at:timestamp("created_at").notNull().defaultNow(),
    updated_at:timestamp("updated_at").notNull().defaultNow().
    $onUpdate(() => new Date()),
    title:text("title"),
    url:text("url").unique().notNull(),
    description:text("description"),
    published_at:timestamp("published_at").notNull(),
    feed_id:uuid("feed_id").references(()=>
      feeds.id
    )


})

  