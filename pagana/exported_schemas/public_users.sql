--
-- PostgreSQL database dump
--

\restrict eChsbsyDcgHQoN0DJbv4mozX5BzB29YYNEhKV6vUFelodVjDQdZoqkgN992wFgb

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
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."users" (
    "uid" "uuid" NOT NULL,
    "create_time" timestamp with time zone DEFAULT "now"() NOT NULL,
    "update_time" timestamp with time zone DEFAULT "now"() NOT NULL,
    "photo" character varying(1024) DEFAULT ''::character varying NOT NULL,
    "description" character varying(1024) DEFAULT ''::character varying NOT NULL,
    "status" integer DEFAULT 0 NOT NULL,
    "nickname" character varying(128) DEFAULT ''::character varying NOT NULL,
    "website" character varying(128)
);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."users" ("uid", "create_time", "update_time", "photo", "description", "status", "nickname", "website") FROM stdin;
\.


--
-- Name: users users_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pk" PRIMARY KEY ("uid");


--
-- PostgreSQL database dump complete
--

\unrestrict eChsbsyDcgHQoN0DJbv4mozX5BzB29YYNEhKV6vUFelodVjDQdZoqkgN992wFgb

