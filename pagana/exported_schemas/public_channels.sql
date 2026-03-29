--
-- PostgreSQL database dump
--

\restrict n2LoKqhkKANi0anHD7lsRS7su8bfpaXgMICRiP8KyTyCQ1cCAofYSpbrhMEN1fD

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
-- Name: channels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."channels" (
    "uid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(256),
    "description" character varying(1024),
    "image" character varying(1024),
    "status" integer DEFAULT 0,
    "create_time" timestamp without time zone DEFAULT "now"() NOT NULL,
    "update_time" timestamp without time zone DEFAULT "now"() NOT NULL,
    "lang" character varying(8),
    "owner" "uuid" NOT NULL,
    "title" character varying(256)
);


--
-- Name: TABLE "channels"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE "public"."channels" IS 'uid';


--
-- Data for Name: channels; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."channels" ("uid", "name", "description", "image", "status", "create_time", "update_time", "lang", "owner", "title") FROM stdin;
ad3914e1-bb8e-7260-8000-0000434418f1	发地方的萨法的	方式范德萨方式大		0	2026-03-06 15:15:58.935131	2026-03-06 15:15:58.935131	\N	a75a0ada-16c4-11f1-987b-42a82e58ed77	\N
ad391c53-f36e-7343-8000-000050980038	嘎嘎嘎嘎啥	方法胜多负少		0	2026-03-06 15:16:11.427721	2026-03-06 15:16:11.427721	\N	a75a0ada-16c4-11f1-987b-42a82e58ed77	\N
\.


--
-- Name: channels channels_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."channels"
    ADD CONSTRAINT "channels_pk" PRIMARY KEY ("uid");


--
-- PostgreSQL database dump complete
--

\unrestrict n2LoKqhkKANi0anHD7lsRS7su8bfpaXgMICRiP8KyTyCQ1cCAofYSpbrhMEN1fD

