--
-- PostgreSQL database dump
--

\restrict D6L2vY5IeU4z4eNgNRAazBd2eMSZhrFqQ09SiilX1ezbsGcKnkyPekGI7Wj75pA

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
-- Name: comments; Type: TABLE; Schema: community; Owner: -
--

CREATE TABLE "community"."comments" (
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
-- Name: COLUMN "comments"."thread"; Type: COMMENT; Schema: community; Owner: -
--

COMMENT ON COLUMN "community"."comments"."thread" IS '主评论ID';


--
-- Name: COLUMN "comments"."referer"; Type: COMMENT; Schema: community; Owner: -
--

COMMENT ON COLUMN "community"."comments"."referer" IS '引用ID';


--
-- Name: COLUMN "comments"."resource"; Type: COMMENT; Schema: community; Owner: -
--

COMMENT ON COLUMN "community"."comments"."resource" IS '资源';


--
-- Name: COLUMN "comments"."status"; Type: COMMENT; Schema: community; Owner: -
--

COMMENT ON COLUMN "community"."comments"."status" IS '审核状态';


--
-- Data for Name: comments; Type: TABLE DATA; Schema: community; Owner: -
--

COPY "community"."comments" ("uid", "content", "create_time", "update_time", "creator", "thread", "referer", "resource", "ipaddress", "status", "fingerprint", "email", "nickname", "website", "discover") FROM stdin;
\.


--
-- Name: comments comments_pk; Type: CONSTRAINT; Schema: community; Owner: -
--

ALTER TABLE ONLY "community"."comments"
    ADD CONSTRAINT "comments_pk" PRIMARY KEY ("uid");


--
-- PostgreSQL database dump complete
--

\unrestrict D6L2vY5IeU4z4eNgNRAazBd2eMSZhrFqQ09SiilX1ezbsGcKnkyPekGI7Wj75pA

