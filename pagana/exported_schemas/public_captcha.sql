--
-- PostgreSQL database dump
--

\restrict 2fJnOov8Ftjc9phBnCP2bb1Osxtjxn4jc42ke1ndhxo6IE8XZcZ7ZSq5J2T3Vis

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
-- Name: captcha; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."captcha" (
    "uid" "uuid" NOT NULL,
    "create_time" timestamp with time zone,
    "update_time" timestamp with time zone,
    "checked" integer,
    "content" character varying(2048),
    "used" smallint DEFAULT 0
);


--
-- Data for Name: captcha; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."captcha" ("uid", "create_time", "update_time", "checked", "content", "used") FROM stdin;
\.


--
-- Name: captcha captcha_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."captcha"
    ADD CONSTRAINT "captcha_pk" PRIMARY KEY ("uid");


--
-- PostgreSQL database dump complete
--

\unrestrict 2fJnOov8Ftjc9phBnCP2bb1Osxtjxn4jc42ke1ndhxo6IE8XZcZ7ZSq5J2T3Vis

