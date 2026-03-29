--
-- PostgreSQL database dump
--

\restrict cNMu8KSSOvMvIKafibtzURgPhKXP4uXUe863cKg9k6akyjP8Cc6dQhcVBfs8gD9

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
-- Name: projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."projects" (
    "uid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(128) NOT NULL,
    "description" character varying(1024),
    "title" character varying(128)
);


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."projects" ("uid", "name", "description", "title") FROM stdin;
\.


--
-- Name: projects projects_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_pk" PRIMARY KEY ("uid");


--
-- Name: projects_name_uindex; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "projects_name_uindex" ON "public"."projects" USING "btree" ("name");


--
-- PostgreSQL database dump complete
--

\unrestrict cNMu8KSSOvMvIKafibtzURgPhKXP4uXUe863cKg9k6akyjP8Cc6dQhcVBfs8gD9

