--
-- PostgreSQL database dump
--

\restrict 896de5b4bCzfVgXbmrBdmBWmNYD7bkU9y1Df2kXAJOjbhT3gmKoWMXnIy6Qo3Gd

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
-- Name: access_code; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."access_code" (
    "uid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "create_time" timestamp with time zone,
    "update_time" timestamp with time zone,
    "code" character varying(128),
    "content" character varying(4096),
    "active" integer
);


--
-- Data for Name: access_code; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."access_code" ("uid", "create_time", "update_time", "code", "content", "active") FROM stdin;
1b973f5e-ca9e-453e-aa12-0fb971774e79	2026-02-20 05:28:50.907+08	2026-02-20 05:28:52.378+08	123	123	1
\.


--
-- Name: access_code access_code_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."access_code"
    ADD CONSTRAINT "access_code_pk" PRIMARY KEY ("uid");


--
-- PostgreSQL database dump complete
--

\unrestrict 896de5b4bCzfVgXbmrBdmBWmNYD7bkU9y1Df2kXAJOjbhT3gmKoWMXnIy6Qo3Gd

