--
-- PostgreSQL database dump
--

\restrict ec8zpHQtLi7cJMF2CxsmjMN8YSiym7Ikm5K43Di0nEijE4dmULh3zzbv1IMZ4NQ

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
-- Name: links; Type: TABLE; Schema: community; Owner: -
--

CREATE TABLE "community"."links" (
    "uid" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" character varying(128),
    "nid" bigint NOT NULL,
    "create_time" timestamp without time zone DEFAULT "now"() NOT NULL,
    "name" character varying(16) NOT NULL,
    "description" character varying(1024),
    "status" integer DEFAULT 0 NOT NULL,
    "lang" character varying(8),
    "channel" "uuid" NOT NULL,
    "url" character varying(2048) NOT NULL
);


--
-- Name: links_nid_seq; Type: SEQUENCE; Schema: community; Owner: -
--

CREATE SEQUENCE "community"."links_nid_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: links_nid_seq; Type: SEQUENCE OWNED BY; Schema: community; Owner: -
--

ALTER SEQUENCE "community"."links_nid_seq" OWNED BY "community"."links"."nid";


--
-- Name: links nid; Type: DEFAULT; Schema: community; Owner: -
--

ALTER TABLE ONLY "community"."links" ALTER COLUMN "nid" SET DEFAULT "nextval"('"community"."links_nid_seq"'::"regclass");


--
-- Data for Name: links; Type: TABLE DATA; Schema: community; Owner: -
--

COPY "community"."links" ("uid", "title", "nid", "create_time", "name", "description", "status", "lang", "channel", "url") FROM stdin;
\.


--
-- Name: links_nid_seq; Type: SEQUENCE SET; Schema: community; Owner: -
--

SELECT pg_catalog.setval('"community"."links_nid_seq"', 1, false);


--
-- Name: links links_pk; Type: CONSTRAINT; Schema: community; Owner: -
--

ALTER TABLE ONLY "community"."links"
    ADD CONSTRAINT "links_pk" PRIMARY KEY ("uid");


--
-- Name: links_name_channel_uindex; Type: INDEX; Schema: community; Owner: -
--

CREATE UNIQUE INDEX "links_name_channel_uindex" ON "community"."links" USING "btree" ("name", "channel");


--
-- PostgreSQL database dump complete
--

\unrestrict ec8zpHQtLi7cJMF2CxsmjMN8YSiym7Ikm5K43Di0nEijE4dmULh3zzbv1IMZ4NQ

