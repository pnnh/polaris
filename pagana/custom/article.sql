insert into articles(uid, title, header, body, description, create_time, update_time,
                     version, build, url, branch, commit, commit_time, relative_path, repo_id, status, owner, name)
values ('0196622f-26b7-775d-b3e1-bf583f59d95c', 'First Article', 'a1b2c3', 'This is the content of the first article.',
 'Description of the first article', now(), now(), '1', '1', 'http://example.com/first-article',
 'main', 'abc123', now(), '/path/to/repo1', '0196622f-e9b6-74ce-b024-b638b6893c22', 1, '00000000-0000-0000-0000-000000000000', 'first-article'),
         ('01966231-ca78-739e-aeae-1ebb783030d4', 'Second Article', 'a1b2c3', 'This is the content of the second article.',
    'Description of the second article', now(), now(), '1', '1', 'http://example.com/second-article',
    'main', 'def456', now(), '/path/to/repo2', '0196622f-e9b6-74ce-b024-b638b6893c22', 1, '00000000-0000-0000-0000-000000000000', 'second-article')
ON CONFLICT (uid) DO NOTHING;