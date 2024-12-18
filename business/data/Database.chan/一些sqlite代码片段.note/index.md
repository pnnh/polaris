---
image: cover.webp
---



```sql

select exists(1) from sqlite_master where name = 'folders';


select load_extension('/Users/Larry/Projects/github/quantum/quantum-sqlite-flutter/macos/Libraries/libsimple.dylib');

create table if not exists main.folders
(
    pk    TEXT primary key,
    title TEXT,
    path  TEXT,
    count integer,
    icon  text,
    bookmark text
);

create virtual table if not exists main.searches
using fts5(
    pk unindexed,
    type unindexed,
    header,
    body, tokenize = 'simple'
);


insert into searches(pk, type, header, body)
values('a', 'folder', '', '文件夹ABC中国');

select * from searches;

select pk, simple_highlight(searches, 0, '[', ']') as info from searches where body match jieba_query('国');



```
