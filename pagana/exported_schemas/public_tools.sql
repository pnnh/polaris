--
-- PostgreSQL database dump
--

\restrict BOrJ6LhRDNySxHwT8KL1C1LwRm452MVNAOFiscN2qaezZNHBMhHmByuXvpEs3QG

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
-- Name: tools; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."tools" (
    "uid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" character varying(128) NOT NULL,
    "create_time" timestamp with time zone DEFAULT "now"() NOT NULL,
    "update_time" timestamp with time zone DEFAULT "now"() NOT NULL,
    "keywords" character varying(128) DEFAULT ''::"text",
    "description" character varying(512) DEFAULT ''::"text",
    "status" integer DEFAULT 0 NOT NULL,
    "cover" character varying(256) DEFAULT ''::"text",
    "owner" "uuid",
    "discover" integer DEFAULT 0 NOT NULL,
    "version" character varying(64),
    "url" character varying(256),
    "lang" character varying(8),
    "name" character varying(256)
);


--
-- Data for Name: tools; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."tools" ("uid", "title", "create_time", "update_time", "keywords", "description", "status", "cover", "owner", "discover", "version", "url", "lang", "name") FROM stdin;
6606288d-5995-4c22-b95f-e32a7adc8419	随机密码生成器	2026-02-11 15:17:47.971788+08	2026-02-11 15:17:47.971788+08			0		\N	0	\N	\N	\N	\N
\.


--
-- Name: tools PK_tools; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."tools"
    ADD CONSTRAINT "PK_tools" PRIMARY KEY ("uid");


--
-- PostgreSQL database dump complete
--

\unrestrict BOrJ6LhRDNySxHwT8KL1C1LwRm452MVNAOFiscN2qaezZNHBMhHmByuXvpEs3QG

