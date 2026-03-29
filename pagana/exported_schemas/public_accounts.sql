--
-- PostgreSQL database dump
--

\restrict 7PJiT2lTpjAJrY17S5wG0gSdJcB3ZDxfWpiQj89cOtQZNWwtCy9dpTG6QjPjpjq

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
-- Name: accounts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."accounts" (
    "uid" "uuid" NOT NULL,
    "create_time" timestamp with time zone DEFAULT "now"() NOT NULL,
    "update_time" timestamp with time zone DEFAULT "now"() NOT NULL,
    "username" character varying(128) NOT NULL,
    "password" character varying(1024) DEFAULT ''::character varying NOT NULL,
    "photo" character varying(1024) DEFAULT ''::character varying NOT NULL,
    "description" character varying(1024) DEFAULT ''::character varying NOT NULL,
    "email" character varying(128) DEFAULT ''::character varying NOT NULL,
    "status" integer DEFAULT 0 NOT NULL,
    "nickname" character varying(128) DEFAULT ''::character varying NOT NULL,
    "credentials" character varying(1024) DEFAULT ''::character varying NOT NULL,
    "session" character varying(1024) DEFAULT ''::character varying NOT NULL,
    "website" character varying(128),
    "fingerprint" character varying(1024)
);


--
-- Name: TABLE "accounts"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE "public"."accounts" IS '账户表';


--
-- Name: COLUMN "accounts"."uid"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."accounts"."uid" IS '主键列';


--
-- Name: COLUMN "accounts"."username"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."accounts"."username" IS '用户名';


--
-- Name: COLUMN "accounts"."password"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."accounts"."password" IS '密码';


--
-- Name: COLUMN "accounts"."email"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."accounts"."email" IS '电子邮件';


--
-- Name: COLUMN "accounts"."status"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."accounts"."status" IS '可用状态';


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."accounts" ("uid", "create_time", "update_time", "username", "password", "photo", "description", "email", "status", "nickname", "credentials", "session", "website", "fingerprint") FROM stdin;
a75a0ada-16c4-11f1-987b-42a82e58ed77	2026-03-03 13:48:50.236748+08	2026-03-03 13:48:50.236748+08	xspanni	$2a$14$o4caS009Pf0SMqRVt42XtOvct.RYlAor/DOrNF97kvjdnHEHDSkiO			xspanni@gmail.com	0	xspanni				dc93b8cafbcab6903d7eecc1f3e1a232
\.


--
-- Name: accounts accounts_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."accounts"
    ADD CONSTRAINT "accounts_pk" PRIMARY KEY ("uid");


--
-- Name: accounts_index_account; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "accounts_index_account" ON "public"."accounts" USING "btree" ("username");


--
-- PostgreSQL database dump complete
--

\unrestrict 7PJiT2lTpjAJrY17S5wG0gSdJcB3ZDxfWpiQj89cOtQZNWwtCy9dpTG6QjPjpjq

