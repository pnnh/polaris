--
-- PostgreSQL database dump
--

\restrict ToQAbbQxBcNY5oRB1eFuDCdjnkq9ZznTgSaNDJf92874Pye30FfBmuFOj5tqya4

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
-- Name: libraries; Type: TABLE; Schema: community; Owner: -
--

CREATE TABLE "community"."libraries" (
    "uid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "nid" bigint NOT NULL,
    "name" character varying(256),
    "create_time" timestamp with time zone DEFAULT "now"(),
    "update_time" timestamp with time zone DEFAULT "now"(),
    "description" character varying(2048),
    "owner" "uuid"
);


--
-- Name: libraries_nid_seq; Type: SEQUENCE; Schema: community; Owner: -
--

CREATE SEQUENCE "community"."libraries_nid_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: libraries_nid_seq; Type: SEQUENCE OWNED BY; Schema: community; Owner: -
--

ALTER SEQUENCE "community"."libraries_nid_seq" OWNED BY "community"."libraries"."nid";


--
-- Name: libraries nid; Type: DEFAULT; Schema: community; Owner: -
--

ALTER TABLE ONLY "community"."libraries" ALTER COLUMN "nid" SET DEFAULT "nextval"('"community"."libraries_nid_seq"'::"regclass");


--
-- Data for Name: libraries; Type: TABLE DATA; Schema: community; Owner: -
--

COPY "community"."libraries" ("uid", "nid", "name", "create_time", "update_time", "description", "owner") FROM stdin;
\.


--
-- Name: libraries_nid_seq; Type: SEQUENCE SET; Schema: community; Owner: -
--

SELECT pg_catalog.setval('"community"."libraries_nid_seq"', 1, false);


--
-- Name: libraries libraries_pk; Type: CONSTRAINT; Schema: community; Owner: -
--

ALTER TABLE ONLY "community"."libraries"
    ADD CONSTRAINT "libraries_pk" PRIMARY KEY ("uid");


--
-- PostgreSQL database dump complete
--

\unrestrict ToQAbbQxBcNY5oRB1eFuDCdjnkq9ZznTgSaNDJf92874Pye30FfBmuFOj5tqya4

