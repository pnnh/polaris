--
-- PostgreSQL database dump
--

\restrict p1RpXnMoOt01wfV86uMLMTeXD8jl2Axibv1PE3SIbW8DG7ntQ8ICI7mwd0SMJdl

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
-- Name: notebooks; Type: TABLE; Schema: personal; Owner: -
--

CREATE TABLE "personal"."notebooks" (
    "uid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "create_time" timestamp with time zone DEFAULT "now"() NOT NULL,
    "update_time" timestamp with time zone DEFAULT "now"() NOT NULL,
    "description" character varying(256),
    "name" character varying(128) DEFAULT ''::character varying NOT NULL,
    "image" character varying(2048),
    "owner" "uuid" NOT NULL
);


--
-- Data for Name: notebooks; Type: TABLE DATA; Schema: personal; Owner: -
--

COPY "personal"."notebooks" ("uid", "create_time", "update_time", "description", "name", "image", "owner") FROM stdin;
\.


--
-- Name: notebooks PK_channels; Type: CONSTRAINT; Schema: personal; Owner: -
--

ALTER TABLE ONLY "personal"."notebooks"
    ADD CONSTRAINT "PK_channels" PRIMARY KEY ("uid");


--
-- PostgreSQL database dump complete
--

\unrestrict p1RpXnMoOt01wfV86uMLMTeXD8jl2Axibv1PE3SIbW8DG7ntQ8ICI7mwd0SMJdl

