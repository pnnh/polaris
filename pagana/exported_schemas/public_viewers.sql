--
-- PostgreSQL database dump
--

\restrict ucSdW6krXB3egVVztHHWpZVCCE1zM7ZGYFJ7DAMUN219ClCRC3ShxCkIoS0nymI

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
-- Name: viewers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."viewers" (
    "uid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "source" "uuid",
    "target" "uuid",
    "create_time" timestamp with time zone,
    "update_time" timestamp with time zone,
    "title" character varying(256),
    "address" character varying(128),
    "class" character varying(64),
    "owner" "uuid",
    "channel" "uuid",
    "direction" character varying(16),
    "headers" character varying(4096),
    "city" character varying(256)
);


--
-- Data for Name: viewers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."viewers" ("uid", "source", "target", "create_time", "update_time", "title", "address", "class", "owner", "channel", "direction", "headers", "city") FROM stdin;
\.


--
-- Name: viewers viewers_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."viewers"
    ADD CONSTRAINT "viewers_pk" PRIMARY KEY ("uid");


--
-- PostgreSQL database dump complete
--

\unrestrict ucSdW6krXB3egVVztHHWpZVCCE1zM7ZGYFJ7DAMUN219ClCRC3ShxCkIoS0nymI

