--
-- PostgreSQL database dump
--

\restrict Bs1nwOEslgnXoncbD0S5XezFxAI4oOcPjsg4f1XGMSG2Mbq79N04GB4yM9Gsx6z

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
-- Name: repo_sync; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."repo_sync" (
    "uid" "uuid" NOT NULL,
    "last_commit_id" character varying(64),
    "branch" character varying(64),
    "repo_id" character varying(64),
    "source_path" character varying(256),
    "first_commit_id" character varying(96)
);


--
-- Data for Name: repo_sync; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."repo_sync" ("uid", "last_commit_id", "branch", "repo_id", "source_path", "first_commit_id") FROM stdin;
\.


--
-- Name: repo_sync repo_sync_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."repo_sync"
    ADD CONSTRAINT "repo_sync_pk" PRIMARY KEY ("uid");


--
-- PostgreSQL database dump complete
--

\unrestrict Bs1nwOEslgnXoncbD0S5XezFxAI4oOcPjsg4f1XGMSG2Mbq79N04GB4yM9Gsx6z

