--
-- PostgreSQL database dump
--

\restrict 2pmSu81pkBafDREVTI6WJjIR3mIVBGLk0IUM5PODbL8kmFoqYIp2lLhbgy7MTDh

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
-- Name: applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."applications" (
    "uid" "uuid" NOT NULL,
    "id" character varying DEFAULT ''::character varying NOT NULL,
    "secret" character varying DEFAULT ''::character varying NOT NULL,
    "rotated_secrets" character varying DEFAULT ''::character varying NOT NULL,
    "redirect_uris" character varying DEFAULT ''::character varying NOT NULL,
    "response_types" character varying DEFAULT ''::character varying,
    "grant_types" character varying DEFAULT ''::character varying,
    "scopes" character varying DEFAULT ''::character varying NOT NULL,
    "audience" character varying DEFAULT ''::character varying NOT NULL,
    "creator" character varying NOT NULL,
    "title" character varying DEFAULT ''::character varying NOT NULL,
    "create_time" timestamp without time zone DEFAULT "now"() NOT NULL,
    "update_time" timestamp without time zone DEFAULT "now"() NOT NULL,
    "description" character varying DEFAULT ''::character varying NOT NULL,
    "public" integer DEFAULT 0 NOT NULL,
    "site_url" character varying(256) DEFAULT ''::character varying NOT NULL,
    "status" integer DEFAULT 0 NOT NULL,
    "image" character varying(1024) DEFAULT ''::character varying NOT NULL,
    "rank" integer DEFAULT 0 NOT NULL
);


--
-- Name: TABLE "applications"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE "public"."applications" IS 'oauth2 clients';


--
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."applications" ("uid", "id", "secret", "rotated_secrets", "redirect_uris", "response_types", "grant_types", "scopes", "audience", "creator", "title", "create_time", "update_time", "description", "public", "site_url", "status", "image", "rank") FROM stdin;
\.


--
-- Name: applications pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."applications"
    ADD CONSTRAINT "pk" PRIMARY KEY ("uid");


--
-- PostgreSQL database dump complete
--

\unrestrict 2pmSu81pkBafDREVTI6WJjIR3mIVBGLk0IUM5PODbL8kmFoqYIp2lLhbgy7MTDh

