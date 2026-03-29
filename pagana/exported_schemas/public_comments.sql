--
-- PostgreSQL database dump
--

\restrict e7InxgyzS5U9VWbDLRgNDSYFHa5YsfMHsacg8FduHwgpXm7mDkYo52tn36j41xz

-- Dumped from database version 18.1 (Homebrew)
-- Dumped by pg_dump version 18.1 (Homebrew)

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
-- Name: comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."comments" (
    "uid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "content" character varying(4906) NOT NULL,
    "create_time" timestamp without time zone DEFAULT "now"(),
    "update_time" timestamp without time zone DEFAULT "now"(),
    "creator" "uuid",
    "thread" "uuid",
    "referer" "uuid",
    "resource" "uuid",
    "ipaddress" character varying(128),
    "status" integer DEFAULT 0,
    "fingerprint" character varying(1024),
    "email" character varying(128),
    "nickname" character varying(128),
    "website" character varying(128),
    "discover" integer DEFAULT 0 NOT NULL
);


--
-- Name: COLUMN "comments"."thread"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."comments"."thread" IS '主评论ID';


--
-- Name: COLUMN "comments"."referer"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."comments"."referer" IS '引用ID';


--
-- Name: COLUMN "comments"."resource"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."comments"."resource" IS '资源';


--
-- Name: COLUMN "comments"."status"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."comments"."status" IS '审核状态';


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."comments" ("uid", "content", "create_time", "update_time", "creator", "thread", "referer", "resource", "ipaddress", "status", "fingerprint", "email", "nickname", "website", "discover") FROM stdin;
\.


--
-- Name: comments comments_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_pk" PRIMARY KEY ("uid");


--
-- PostgreSQL database dump complete
--

\unrestrict e7InxgyzS5U9VWbDLRgNDSYFHa5YsfMHsacg8FduHwgpXm7mDkYo52tn36j41xz

