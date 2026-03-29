--
-- PostgreSQL database dump
--

\restrict vRwWvTM1huZDN2gkVAkyzjbpRwrNXCDYb91br3KyLQ02Bxcgnydv6DmWR7MvKHF

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
-- Name: libraries; Type: TABLE; Schema: personal; Owner: -
--

CREATE TABLE "personal"."libraries" (
    "uid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "nid" bigint NOT NULL,
    "name" character varying(256),
    "create_time" timestamp with time zone DEFAULT "now"(),
    "update_time" timestamp with time zone DEFAULT "now"(),
    "description" character varying(2048),
    "owner" "uuid"
);


--
-- Name: libraries_nid_seq; Type: SEQUENCE; Schema: personal; Owner: -
--

CREATE SEQUENCE "personal"."libraries_nid_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: libraries_nid_seq; Type: SEQUENCE OWNED BY; Schema: personal; Owner: -
--

ALTER SEQUENCE "personal"."libraries_nid_seq" OWNED BY "personal"."libraries"."nid";


--
-- Name: libraries nid; Type: DEFAULT; Schema: personal; Owner: -
--

ALTER TABLE ONLY "personal"."libraries" ALTER COLUMN "nid" SET DEFAULT "nextval"('"personal"."libraries_nid_seq"'::"regclass");


--
-- Data for Name: libraries; Type: TABLE DATA; Schema: personal; Owner: -
--

COPY "personal"."libraries" ("uid", "nid", "name", "create_time", "update_time", "description", "owner") FROM stdin;
\.


--
-- Name: libraries_nid_seq; Type: SEQUENCE SET; Schema: personal; Owner: -
--

SELECT pg_catalog.setval('"personal"."libraries_nid_seq"', 1, false);


--
-- Name: libraries libraries_pk; Type: CONSTRAINT; Schema: personal; Owner: -
--

ALTER TABLE ONLY "personal"."libraries"
    ADD CONSTRAINT "libraries_pk" PRIMARY KEY ("uid");


--
-- PostgreSQL database dump complete
--

\unrestrict vRwWvTM1huZDN2gkVAkyzjbpRwrNXCDYb91br3KyLQ02Bxcgnydv6DmWR7MvKHF

