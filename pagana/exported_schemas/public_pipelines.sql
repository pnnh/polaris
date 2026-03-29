--
-- PostgreSQL database dump
--

\restrict l03q2BoKzCRXfpRCzRu1wQ1c17dNub8hcpgiTeddNySNzOE0jOq3YFiVFNujfuS

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
-- Name: pipelines; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."pipelines" (
    "uid" "uuid" NOT NULL,
    "title" character varying(128),
    "description" character varying(1024),
    "create_time" timestamp without time zone
);


--
-- Data for Name: pipelines; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."pipelines" ("uid", "title", "description", "create_time") FROM stdin;
\.


--
-- Name: pipelines pipelines_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."pipelines"
    ADD CONSTRAINT "pipelines_pk" PRIMARY KEY ("uid");


--
-- PostgreSQL database dump complete
--

\unrestrict l03q2BoKzCRXfpRCzRu1wQ1c17dNub8hcpgiTeddNySNzOE0jOq3YFiVFNujfuS

