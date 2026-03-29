delete from files where 1=1;
delete from images where 1=1;
delete from notes where 1=1;
delete from photos where 1=1;

select * from files where parent is null;

select count(1) from files;

select parent, name, count(1) from files group by parent, name having count(1) > 1;

select name, parent from files where name = 'blog';

select * from files where mimetype = 'directory';

select * from files where parent = 'f4d179a8-108a-11f1-9b30-6c02e0549f86';

CREATE EXTENSION IF NOT EXISTS ltree;

select uid, name, path from files limit 100;

SELECT ancestors.*
FROM files AS target,
     files AS ancestors
WHERE target.uid = '3398953e-1140-11f1-a4b3-6c02e0549f86'
  AND ancestors.path @> target.path
ORDER BY nlevel(ancestors.path);

update files set status = 1;
update images set status = 1;
update notes set status = 1;
update photos set status = 1;

select * from files where uid = 'ab96b2cd-1221-11f1-a600-6c02e0549f86';

select * from images where uid = 'ab96b2cd-1221-11f1-a600-6c02e0549f86';

insert into articles(uid, title, header, body, create_time, update_time, keywords, description, status, cover, owner,
                     channel, discover, partition, version, build, url, branch, commit, commit_time, relative_path, repo_id,
                     lang, name, checksum, syncno, repo_first_commit)
select uid, title, header, body, create_time, update_time, keywords, description, status, cover, owner,
                     channel, discover, partition, null, null, null, null, null, null,
                     null, null,
                     null, null, null, null, null
from notes;

insert into photos(uid, title, create_time, update_time, owner, keywords, description, status, channel, discover)
select uid, title, create_time, update_time, owner, keywords, description, status,  channel, discover
from images;

