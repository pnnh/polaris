--
-- PostgreSQL database dump
--

\restrict oIA2tncOrQwEinVwS3mH51fgpQmYt3EOwBcFnlOpKsujZmNrHAB979N9KCpVN5K

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
-- Name: access_token; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."access_token" (
    "uid" "uuid" NOT NULL,
    "create_time" timestamp with time zone,
    "update_time" timestamp with time zone,
    "signature" character varying(128),
    "content" character varying(4096)
);


--
-- Data for Name: access_token; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."access_token" ("uid", "create_time", "update_time", "signature", "content") FROM stdin;
\.


--
-- Name: access_token access_token_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."access_token"
    ADD CONSTRAINT "access_token_pk" PRIMARY KEY ("uid");


--
-- PostgreSQL database dump complete
--

\unrestrict oIA2tncOrQwEinVwS3mH51fgpQmYt3EOwBcFnlOpKsujZmNrHAB979N9KCpVN5K

