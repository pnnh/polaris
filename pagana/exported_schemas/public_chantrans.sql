--
-- PostgreSQL database dump
--

\restrict tqc1ryRcdvouKwKaGr1yVvw2tTcMLfcoGT2VUDcgY1eoAhfBUqueAKBNC11OsYF

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
-- Name: chantrans; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."chantrans" (
    "uid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(256),
    "description" character varying(1024),
    "image" character varying(1024),
    "status" integer DEFAULT 0,
    "create_time" timestamp without time zone DEFAULT "now"() NOT NULL,
    "update_time" timestamp without time zone DEFAULT "now"() NOT NULL,
    "lang" character varying(8),
    "cid" "uuid" DEFAULT "gen_random_uuid"(),
    "owner" "uuid" NOT NULL,
    "title" character varying(256) NOT NULL
);


--
-- Name: TABLE "chantrans"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE "public"."chantrans" IS 'uid';


--
-- Data for Name: chantrans; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."chantrans" ("uid", "name", "description", "image", "status", "create_time", "update_time", "lang", "cid", "owner", "title") FROM stdin;
\.


--
-- Name: chantrans chantrans_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."chantrans"
    ADD CONSTRAINT "chantrans_pk" PRIMARY KEY ("uid");


--
-- Name: chantrans_cid_lang_index; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "chantrans_cid_lang_index" ON "public"."chantrans" USING "btree" ("cid", "lang");


--
-- PostgreSQL database dump complete
--

\unrestrict tqc1ryRcdvouKwKaGr1yVvw2tTcMLfcoGT2VUDcgY1eoAhfBUqueAKBNC11OsYF

