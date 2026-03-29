--
-- PostgreSQL database dump
--

\restrict uiDqI6DocazN5RChOKYc60Hhw9UeaxaxWhJIxBdy7uzFCD32cYch4lrCbOQnFmZ

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
-- Name: configuration; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."configuration" (
    "uid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project" "uuid",
    "application" "uuid",
    "service" "uuid",
    "name" character varying(1024),
    "content" character varying(10240),
    "environment" "uuid"
);


--
-- Data for Name: configuration; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."configuration" ("uid", "project", "application", "service", "name", "content", "environment") FROM stdin;
\.


--
-- Name: configuration configuration_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."configuration"
    ADD CONSTRAINT "configuration_pk" PRIMARY KEY ("uid");


--
-- PostgreSQL database dump complete
--

\unrestrict uiDqI6DocazN5RChOKYc60Hhw9UeaxaxWhJIxBdy7uzFCD32cYch4lrCbOQnFmZ

