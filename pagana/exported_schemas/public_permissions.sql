--
-- PostgreSQL database dump
--

\restrict YqQQRT8jmmIMzIpMewoLufhnfjC1MFpgz0GjYqT3YLZj4nRu8dEXuxBON7iPhTY

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
-- Name: permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."permissions" (
    "uid" "uuid" NOT NULL,
    "create_time" timestamp with time zone DEFAULT "now"() NOT NULL,
    "update_time" timestamp with time zone DEFAULT "now"() NOT NULL,
    "description" character varying(1024) DEFAULT ''::character varying NOT NULL,
    "status" integer DEFAULT 0 NOT NULL,
    "name" character varying(128) DEFAULT ''::character varying NOT NULL,
    "scope" character varying(128) DEFAULT ''::character varying NOT NULL,
    "content" character varying(128) DEFAULT ''::character varying NOT NULL
);


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."permissions" ("uid", "create_time", "update_time", "description", "status", "name", "scope", "content") FROM stdin;
\.


--
-- Name: permissions permissions_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."permissions"
    ADD CONSTRAINT "permissions_pk" PRIMARY KEY ("uid");


--
-- PostgreSQL database dump complete
--

\unrestrict YqQQRT8jmmIMzIpMewoLufhnfjC1MFpgz0GjYqT3YLZj4nRu8dEXuxBON7iPhTY

