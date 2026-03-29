--
-- PostgreSQL database dump
--

\restrict naKbxbhaj49uVlBqUNtjmBYYV1zyYWkFtyh0QcZIy7S40rt5HlJOaoZBBv8Nrjm

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
-- Name: repo_files; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."repo_files" (
    "uid" character varying(64) NOT NULL,
    "branch" character varying(64),
    "commit_id" character varying(64),
    "src_path" character varying(1024),
    "target_path" character varying(1024),
    "mime" character varying(64),
    "create_time" timestamp with time zone,
    "update_time" timestamp with time zone,
    "repo_id" character varying(96),
    "checksum" character varying(512),
    "syncno" character varying(256),
    "repo_first_commit" character varying(96),
    "relative_path" character varying(2048),
    "is_dir" boolean
);


--
-- Data for Name: repo_files; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."repo_files" ("uid", "branch", "commit_id", "src_path", "target_path", "mime", "create_time", "update_time", "repo_id", "checksum", "syncno", "repo_first_commit", "relative_path", "is_dir") FROM stdin;
\.


--
-- Name: repo_files repo_file_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."repo_files"
    ADD CONSTRAINT "repo_file_unique" UNIQUE ("repo_first_commit", "relative_path", "branch");


--
-- Name: repo_files repo_files_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."repo_files"
    ADD CONSTRAINT "repo_files_pk" PRIMARY KEY ("uid");


--
-- PostgreSQL database dump complete
--

\unrestrict naKbxbhaj49uVlBqUNtjmBYYV1zyYWkFtyh0QcZIy7S40rt5HlJOaoZBBv8Nrjm

