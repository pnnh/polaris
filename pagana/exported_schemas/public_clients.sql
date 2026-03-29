--
-- PostgreSQL database dump
--

\restrict 0fZQYgjL1hZ0XA2l9UTPuzZMPk7Fq2MhA2vhNugGlDOgARCvgLagCxTzWQbyr0B

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
-- Name: clients; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."clients" (
    "uid" "uuid" NOT NULL,
    "name" character varying(128),
    "description" character varying(1024),
    "project" "uuid",
    "application" "uuid",
    "source" character varying(1024)
);


--
-- Data for Name: clients; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."clients" ("uid", "name", "description", "project", "application", "source") FROM stdin;
\.


--
-- Name: clients clients_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."clients"
    ADD CONSTRAINT "clients_pk" PRIMARY KEY ("uid");


--
-- PostgreSQL database dump complete
--

\unrestrict 0fZQYgjL1hZ0XA2l9UTPuzZMPk7Fq2MhA2vhNugGlDOgARCvgLagCxTzWQbyr0B

