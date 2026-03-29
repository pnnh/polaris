--
-- PostgreSQL database dump
--

\restrict L8kxP5ty2yFRQqwoFuDYCWfc7SEbekF4gnO0TeLVdFNLLOCMdYSKiy08jzcOTu7

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
-- Name: translation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."translation" (
    "uid" "uuid" NOT NULL,
    "name" character varying(256),
    "content" character varying(4096),
    "lang" character varying(8),
    "create_time" timestamp with time zone,
    "update_time" timestamp with time zone
);


--
-- Data for Name: translation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."translation" ("uid", "name", "content", "lang", "create_time", "update_time") FROM stdin;
\.


--
-- Name: translation translation_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."translation"
    ADD CONSTRAINT "translation_pk" PRIMARY KEY ("uid");


--
-- PostgreSQL database dump complete
--

\unrestrict L8kxP5ty2yFRQqwoFuDYCWfc7SEbekF4gnO0TeLVdFNLLOCMdYSKiy08jzcOTu7

