--
-- PostgreSQL database dump
--

\restrict kbcTCJYZm2w3D4nlgW3wQaNBz3R4wLcIYDlAAbIamLW7dtLyW51psaeTVbfXtvg

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
-- Name: libraries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."libraries" (
    "uid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "nid" bigint NOT NULL,
    "name" character varying(256),
    "create_time" timestamp with time zone DEFAULT "now"(),
    "update_time" timestamp with time zone DEFAULT "now"(),
    "description" character varying(2048),
    "owner" "uuid"
);


--
-- Name: libraries_nid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."libraries_nid_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: libraries_nid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."libraries_nid_seq" OWNED BY "public"."libraries"."nid";


--
-- Name: libraries nid; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."libraries" ALTER COLUMN "nid" SET DEFAULT "nextval"('"public"."libraries_nid_seq"'::"regclass");


--
-- Data for Name: libraries; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."libraries" ("uid", "nid", "name", "create_time", "update_time", "description", "owner") FROM stdin;
\.


--
-- Name: libraries_nid_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."libraries_nid_seq"', 1, false);


--
-- Name: libraries libraries_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."libraries"
    ADD CONSTRAINT "libraries_pk" PRIMARY KEY ("uid");


--
-- PostgreSQL database dump complete
--

\unrestrict kbcTCJYZm2w3D4nlgW3wQaNBz3R4wLcIYDlAAbIamLW7dtLyW51psaeTVbfXtvg

