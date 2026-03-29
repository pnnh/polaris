--
-- PostgreSQL database dump
--

\restrict GhhhEdRnttrXFylXlTgXCBkyfeqpJI6eyFlke1DH5fRMUdWF6sHLKcQMqgaLgit

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
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."sessions" (
    "uid" "uuid" NOT NULL,
    "content" character varying(256) NOT NULL,
    "create_time" timestamp with time zone NOT NULL,
    "update_time" timestamp with time zone NOT NULL,
    "username" character varying(96) NOT NULL,
    "type" character varying(96) NOT NULL,
    "code" character varying(256),
    "client_id" character varying(128),
    "response_type" character varying(128),
    "redirect_uri" character varying(512),
    "scope" character varying(256),
    "state" character varying(128),
    "nonce" character varying(128),
    "id_token" character varying(1024),
    "access_token" character varying(512),
    "jwt_id" character varying(96),
    "open_id" character varying(96),
    "company_id" character varying(96),
    "account" "uuid",
    "address" character varying(96),
    "link" character varying(128),
    "client" character varying(32)
);


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."sessions" ("uid", "content", "create_time", "update_time", "username", "type", "code", "client_id", "response_type", "redirect_uri", "scope", "state", "nonce", "id_token", "access_token", "jwt_id", "open_id", "company_id", "account", "address", "link", "client") FROM stdin;
a75c82a6-16c4-11f1-987b-42a82e58ed77		2026-03-03 13:48:50.245496+08	2026-03-03 13:48:50.245496+08	xspanni	signup													a75a0ada-16c4-11f1-987b-42a82e58ed77		\N	\N
273bb6b4-1921-11f1-8663-42a82e58ed77		2026-03-06 13:56:00.804145+08	2026-03-06 13:56:00.804145+08	xspanni	signin													a75a0ada-16c4-11f1-987b-42a82e58ed77		\N	\N
f2481906-1d13-11f1-b165-42a82e58ed79		2026-03-11 14:31:33.159297+08	2026-03-11 14:31:33.159297+08	xspanni	signin													a75a0ada-16c4-11f1-987b-42a82e58ed77		\N	\N
c536fae0-2434-11f1-9852-42a82e58ed77		2026-03-20 16:14:09.081174+08	2026-03-20 16:14:09.081174+08	xspanni	signin													a75a0ada-16c4-11f1-987b-42a82e58ed77		\N	\N
\.


--
-- Name: sessions sessions_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."sessions"
    ADD CONSTRAINT "sessions_pk" PRIMARY KEY ("uid");


--
-- PostgreSQL database dump complete
--

\unrestrict GhhhEdRnttrXFylXlTgXCBkyfeqpJI6eyFlke1DH5fRMUdWF6sHLKcQMqgaLgit

