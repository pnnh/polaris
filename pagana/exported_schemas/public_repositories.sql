--
-- PostgreSQL database dump
--

\restrict I6NMk2kfkUR8v3kBlsNfW44RrvzU1onDQwMI2xcdCy2DOdoYLElYNYaaBkfAkZ8

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
-- Name: repositories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."repositories" (
    "uid" "uuid" NOT NULL,
    "remote_url" character varying(1024),
    "file_path" character varying(1024)
);


--
-- Data for Name: repositories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."repositories" ("uid", "remote_url", "file_path") FROM stdin;
\.


--
-- Name: repositories repositories_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."repositories"
    ADD CONSTRAINT "repositories_pk" PRIMARY KEY ("uid");


--
-- PostgreSQL database dump complete
--

\unrestrict I6NMk2kfkUR8v3kBlsNfW44RrvzU1onDQwMI2xcdCy2DOdoYLElYNYaaBkfAkZ8

