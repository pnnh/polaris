--
-- PostgreSQL database dump
--

\restrict AbIiQCG0ueg12EFj6Qxbxag34Jy1X3gkUyKO6hsQTwiY5AFKfI1f3dY8WuwNkqZ

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
-- Name: roles; Type: TABLE; Schema: community; Owner: -
--

CREATE TABLE "community"."roles" (
    "uid" "uuid" NOT NULL,
    "create_time" timestamp with time zone DEFAULT "now"() NOT NULL,
    "update_time" timestamp with time zone DEFAULT "now"() NOT NULL,
    "description" character varying(1024) DEFAULT ''::character varying NOT NULL,
    "status" integer DEFAULT 0 NOT NULL,
    "name" character varying(128) DEFAULT ''::character varying NOT NULL
);


--
-- Data for Name: roles; Type: TABLE DATA; Schema: community; Owner: -
--

COPY "community"."roles" ("uid", "create_time", "update_time", "description", "status", "name") FROM stdin;
\.


--
-- Name: roles roles_pk; Type: CONSTRAINT; Schema: community; Owner: -
--

ALTER TABLE ONLY "community"."roles"
    ADD CONSTRAINT "roles_pk" PRIMARY KEY ("uid");


--
-- PostgreSQL database dump complete
--

\unrestrict AbIiQCG0ueg12EFj6Qxbxag34Jy1X3gkUyKO6hsQTwiY5AFKfI1f3dY8WuwNkqZ

