--
-- PostgreSQL database dump
--

\restrict v1HXomdZxHSdoW0ghOUXvR12SgL2SNfdGAgtZVwhM706LerJR9FFebICylpTOeC

-- Dumped from database version 18.3 (Homebrew)
-- Dumped by pg_dump version 18.3 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = "heap";

--
-- Name: viewers; Type: TABLE; Schema: community; Owner: -
--

CREATE TABLE "community"."viewers" (
    "uid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "source" "uuid",
    "target" "uuid",
    "create_time" timestamp with time zone,
    "update_time" timestamp with time zone,
    "title" character varying(256),
    "address" character varying(128),
    "class" character varying(64),
    "owner" "uuid",
    "channel" "uuid",
    "direction" character varying(16),
    "headers" character varying(4096),
    "city" character varying(256)
);


--
-- Data for Name: viewers; Type: TABLE DATA; Schema: community; Owner: -
--

COPY "community"."viewers" ("uid", "source", "target", "create_time", "update_time", "title", "address", "class", "owner", "channel", "direction", "headers", "city") FROM stdin;
d335f742-1df7-11f1-8474-42a82e58ed79	a75a0ada-16c4-11f1-987b-42a82e58ed77	94fd5078-12f9-11f1-91d1-42a82e58ed79	2026-03-12 17:42:46.286669+08	2026-03-12 17:42:46.286669+08		::1	note	a75a0ada-16c4-11f1-987b-42a82e58ed77	\N	uta	connection: close\nhost: huable.local\nx-real-ip: ::1\nx-forwarded-for: ::1\nx-forwarded-host: huable.local\nx-forwarded-proto: https\npragma: no-cache\ncache-control: no-cache\nsec-ch-ua: "Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"\nsec-ch-ua-mobile: ?0\nsec-ch-ua-platform: "macOS"\nsec-ch-prefers-color-scheme: light\nupgrade-insecure-requests: 1\nuser-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36\naccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7\nsec-fetch-site: same-origin\nsec-fetch-mode: navigate\nsec-fetch-user: ?1\nsec-fetch-dest: document\nreferer: https://huable.local/en/articles\naccept-encoding: gzip, deflate, br, zstd\naccept-language: en,zh-HK;q=0.9,zh-TW;q=0.8,zh;q=0.7,ja;q=0.6,es;q=0.5,hi;q=0.4,de;q=0.3,ru;q=0.2,zh-CN;q=0.1,fr;q=0.1\ncookie: PSTheme=auto; PT=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NzM0Njk4OTMsImlhdCI6MTc3MzIxMDY5MywiaXNzIjoiaHR0cHM6Ly9odWFibGUubG9jYWwvcG9ydGFsIiwianRpIjoiZjI0ODE5MDYtMWQxMy0xMWYxLWIxNjUtNDJhODJlNThlZDc5In0.KMURFoXnO_rShGMoc5dkb31y3y_4F21lks8AzHgVjb9dCT9FOM_F9C_CzeLGtIjHfXEKUalMD9n81vNQnIs0daCS8jZ6qYgMT0hcToFbcTFvc-NuM5X9drRMqIBSo3rM35ZAROiezQeCA9TkYUUyRQ-WfhCA1A87z56rLF1I2vd0mqvvT3mvmpST7E19HrjbZiPjM4SBlIexOFgSvSY8gHOfG3CCV2DtM_kRIdCakIJNCAlpL2-R3aOBdQzfMOE9eXEdS1ke_PNGe-wkdMU20Pg47pJQd8WxhmGMYsYG6AgwMb5bL6UnatA76xrhEBtB7Cnvghr2Y1nkFA6n20R8UA; __next_hmr_refresh_hash__=157\nx-forwarded-port: 7100\nx-ip: ::1\nx-origin: https://localhost:7100\nx-pathname: /en/articles/KQnQDQsaKNyvoAsPPr52iL\nx-search: \nx-url: https://localhost:7100/en/articles/KQnQDQsaKNyvoAsPPr52iL\naccept-ch: Sec-CH-Prefers-Color-Scheme\ncross-origin-embedder-policy: require-corp\ncross-origin-opener-policy: same-origin	\N
d865b90a-1df7-11f1-8474-42a82e58ed79	a75a0ada-16c4-11f1-987b-42a82e58ed77	94fc08bc-12f9-11f1-91d1-42a82e58ed79	2026-03-12 17:42:54.986883+08	2026-03-12 17:42:54.986884+08		::1	note	a75a0ada-16c4-11f1-987b-42a82e58ed77	\N	uta	connection: close\nhost: huable.local\nx-real-ip: ::1\nx-forwarded-for: ::1\nx-forwarded-host: huable.local\nx-forwarded-proto: https\npragma: no-cache\ncache-control: no-cache\nsec-ch-ua: "Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"\nsec-ch-ua-mobile: ?0\nsec-ch-ua-platform: "macOS"\nsec-ch-prefers-color-scheme: light\nupgrade-insecure-requests: 1\nuser-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36\naccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7\nsec-fetch-site: same-origin\nsec-fetch-mode: navigate\nsec-fetch-user: ?1\nsec-fetch-dest: document\nreferer: https://huable.local/en/articles\naccept-encoding: gzip, deflate, br, zstd\naccept-language: en,zh-HK;q=0.9,zh-TW;q=0.8,zh;q=0.7,ja;q=0.6,es;q=0.5,hi;q=0.4,de;q=0.3,ru;q=0.2,zh-CN;q=0.1,fr;q=0.1\ncookie: PSTheme=auto; PT=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NzM0Njk4OTMsImlhdCI6MTc3MzIxMDY5MywiaXNzIjoiaHR0cHM6Ly9odWFibGUubG9jYWwvcG9ydGFsIiwianRpIjoiZjI0ODE5MDYtMWQxMy0xMWYxLWIxNjUtNDJhODJlNThlZDc5In0.KMURFoXnO_rShGMoc5dkb31y3y_4F21lks8AzHgVjb9dCT9FOM_F9C_CzeLGtIjHfXEKUalMD9n81vNQnIs0daCS8jZ6qYgMT0hcToFbcTFvc-NuM5X9drRMqIBSo3rM35ZAROiezQeCA9TkYUUyRQ-WfhCA1A87z56rLF1I2vd0mqvvT3mvmpST7E19HrjbZiPjM4SBlIexOFgSvSY8gHOfG3CCV2DtM_kRIdCakIJNCAlpL2-R3aOBdQzfMOE9eXEdS1ke_PNGe-wkdMU20Pg47pJQd8WxhmGMYsYG6AgwMb5bL6UnatA76xrhEBtB7Cnvghr2Y1nkFA6n20R8UA; __next_hmr_refresh_hash__=157\nx-forwarded-port: 7100\nx-ip: ::1\nx-origin: https://localhost:7100\nx-pathname: /en/articles/KQsKjU3XgxU3qipssi5t27\nx-search: \nx-url: https://localhost:7100/en/articles/KQsKjU3XgxU3qipssi5t27\naccept-ch: Sec-CH-Prefers-Color-Scheme\ncross-origin-embedder-policy: require-corp\ncross-origin-opener-policy: same-origin	\N
\.


--
-- Name: viewers viewers_pk; Type: CONSTRAINT; Schema: community; Owner: -
--

ALTER TABLE ONLY "community"."viewers"
    ADD CONSTRAINT "viewers_pk" PRIMARY KEY ("uid");


--
-- PostgreSQL database dump complete
--

\unrestrict v1HXomdZxHSdoW0ghOUXvR12SgL2SNfdGAgtZVwhM706LerJR9FFebICylpTOeC

