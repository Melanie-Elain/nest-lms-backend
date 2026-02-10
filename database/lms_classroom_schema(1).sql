--
-- PostgreSQL database dump
--

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-02-11 00:24:24

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

--
-- TOC entry 875 (class 1247 OID 21950)
-- Name: course_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.course_status AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'CLOSED'
);


--
-- TOC entry 878 (class 1247 OID 21958)
-- Name: lesson_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.lesson_type AS ENUM (
    'VIDEO',
    'DOCUMENT'
);


--
-- TOC entry 920 (class 1247 OID 22260)
-- Name: questions_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.questions_type_enum AS ENUM (
    'SINGLE',
    'MULTIPLE'
);


--
-- TOC entry 917 (class 1247 OID 22237)
-- Name: users_role_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.users_role_enum AS ENUM (
    'ADMIN',
    'INSTRUCTOR',
    'STUDENT'
);


SET default_table_access_method = heap;

--
-- TOC entry 242 (class 1259 OID 22207)
-- Name: certificates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.certificates (
    id integer NOT NULL,
    user_id integer NOT NULL,
    course_id integer NOT NULL,
    pdf_url text NOT NULL,
    issued_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 241 (class 1259 OID 22206)
-- Name: certificates_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.certificates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5132 (class 0 OID 0)
-- Dependencies: 241
-- Name: certificates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.certificates_id_seq OWNED BY public.certificates.id;


--
-- TOC entry 228 (class 1259 OID 22050)
-- Name: class_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.class_members (
    id integer NOT NULL,
    user_id integer NOT NULL,
    course_id integer NOT NULL,
    joined_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 227 (class 1259 OID 22049)
-- Name: class_members_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.class_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5133 (class 0 OID 0)
-- Dependencies: 227
-- Name: class_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.class_members_id_seq OWNED BY public.class_members.id;


--
-- TOC entry 222 (class 1259 OID 21989)
-- Name: courses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.courses (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    thumbnail text,
    class_code character varying(20) NOT NULL,
    is_archived boolean DEFAULT false,
    status public.course_status DEFAULT 'DRAFT'::public.course_status,
    instructor_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 221 (class 1259 OID 21988)
-- Name: courses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.courses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5134 (class 0 OID 0)
-- Dependencies: 221
-- Name: courses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.courses_id_seq OWNED BY public.courses.id;


--
-- TOC entry 226 (class 1259 OID 22029)
-- Name: lessons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lessons (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    type public.lesson_type NOT NULL,
    content text NOT NULL,
    description text,
    duration integer DEFAULT 0,
    "order" integer NOT NULL,
    section_id integer NOT NULL
);


--
-- TOC entry 225 (class 1259 OID 22028)
-- Name: lessons_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.lessons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5135 (class 0 OID 0)
-- Dependencies: 225
-- Name: lessons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.lessons_id_seq OWNED BY public.lessons.id;


--
-- TOC entry 234 (class 1259 OID 22118)
-- Name: options; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.options (
    id integer NOT NULL,
    question_id integer,
    content text NOT NULL,
    is_correct boolean DEFAULT false NOT NULL
);


--
-- TOC entry 233 (class 1259 OID 22117)
-- Name: options_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.options_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5136 (class 0 OID 0)
-- Dependencies: 233
-- Name: options_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.options_id_seq OWNED BY public.options.id;


--
-- TOC entry 232 (class 1259 OID 22099)
-- Name: questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.questions (
    id integer NOT NULL,
    quiz_id integer,
    content text NOT NULL,
    points integer DEFAULT 1 NOT NULL,
    type public.questions_type_enum DEFAULT 'SINGLE'::public.questions_type_enum NOT NULL
);


--
-- TOC entry 231 (class 1259 OID 22098)
-- Name: questions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5137 (class 0 OID 0)
-- Dependencies: 231
-- Name: questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.questions_id_seq OWNED BY public.questions.id;


--
-- TOC entry 230 (class 1259 OID 22073)
-- Name: quizzes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quizzes (
    id integer NOT NULL,
    description text,
    time_limit integer NOT NULL,
    pass_score integer DEFAULT 50 NOT NULL,
    course_id integer NOT NULL,
    section_id integer,
    title character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 229 (class 1259 OID 22072)
-- Name: quizzes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.quizzes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5138 (class 0 OID 0)
-- Dependencies: 229
-- Name: quizzes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.quizzes_id_seq OWNED BY public.quizzes.id;


--
-- TOC entry 224 (class 1259 OID 22013)
-- Name: sections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sections (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    "order" integer NOT NULL,
    course_id integer NOT NULL
);


--
-- TOC entry 223 (class 1259 OID 22012)
-- Name: sections_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5139 (class 0 OID 0)
-- Dependencies: 223
-- Name: sections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sections_id_seq OWNED BY public.sections.id;


--
-- TOC entry 238 (class 1259 OID 22157)
-- Name: submission_answers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.submission_answers (
    id integer NOT NULL,
    submission_id integer NOT NULL,
    question_id integer NOT NULL,
    selected_option_id integer NOT NULL
);


--
-- TOC entry 237 (class 1259 OID 22156)
-- Name: submission_answers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.submission_answers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5140 (class 0 OID 0)
-- Dependencies: 237
-- Name: submission_answers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.submission_answers_id_seq OWNED BY public.submission_answers.id;


--
-- TOC entry 236 (class 1259 OID 22136)
-- Name: submissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.submissions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    quiz_id integer NOT NULL,
    score numeric(5,2),
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    completed_at timestamp with time zone
);


--
-- TOC entry 235 (class 1259 OID 22135)
-- Name: submissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.submissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5141 (class 0 OID 0)
-- Dependencies: 235
-- Name: submissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.submissions_id_seq OWNED BY public.submissions.id;


--
-- TOC entry 240 (class 1259 OID 22183)
-- Name: user_progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_progress (
    id integer NOT NULL,
    user_id integer NOT NULL,
    lesson_id integer NOT NULL,
    is_completed boolean DEFAULT false,
    updated_at timestamp with time zone DEFAULT now()
);


--
-- TOC entry 239 (class 1259 OID 22182)
-- Name: user_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5142 (class 0 OID 0)
-- Dependencies: 239
-- Name: user_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_progress_id_seq OWNED BY public.user_progress.id;


--
-- TOC entry 220 (class 1259 OID 21970)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    role public.users_role_enum DEFAULT 'STUDENT'::public.users_role_enum NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    full_name character varying NOT NULL,
    avatar character varying,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 219 (class 1259 OID 21969)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5143 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4906 (class 2604 OID 22210)
-- Name: certificates id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certificates ALTER COLUMN id SET DEFAULT nextval('public.certificates_id_seq'::regclass);


--
-- TOC entry 4889 (class 2604 OID 22053)
-- Name: class_members id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.class_members ALTER COLUMN id SET DEFAULT nextval('public.class_members_id_seq'::regclass);


--
-- TOC entry 4881 (class 2604 OID 21992)
-- Name: courses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses ALTER COLUMN id SET DEFAULT nextval('public.courses_id_seq'::regclass);


--
-- TOC entry 4887 (class 2604 OID 22032)
-- Name: lessons id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons ALTER COLUMN id SET DEFAULT nextval('public.lessons_id_seq'::regclass);


--
-- TOC entry 4898 (class 2604 OID 22121)
-- Name: options id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.options ALTER COLUMN id SET DEFAULT nextval('public.options_id_seq'::regclass);


--
-- TOC entry 4895 (class 2604 OID 22102)
-- Name: questions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.questions ALTER COLUMN id SET DEFAULT nextval('public.questions_id_seq'::regclass);


--
-- TOC entry 4891 (class 2604 OID 22076)
-- Name: quizzes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quizzes ALTER COLUMN id SET DEFAULT nextval('public.quizzes_id_seq'::regclass);


--
-- TOC entry 4886 (class 2604 OID 22016)
-- Name: sections id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sections ALTER COLUMN id SET DEFAULT nextval('public.sections_id_seq'::regclass);


--
-- TOC entry 4902 (class 2604 OID 22160)
-- Name: submission_answers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submission_answers ALTER COLUMN id SET DEFAULT nextval('public.submission_answers_id_seq'::regclass);


--
-- TOC entry 4900 (class 2604 OID 22139)
-- Name: submissions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submissions ALTER COLUMN id SET DEFAULT nextval('public.submissions_id_seq'::regclass);


--
-- TOC entry 4903 (class 2604 OID 22186)
-- Name: user_progress id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_progress ALTER COLUMN id SET DEFAULT nextval('public.user_progress_id_seq'::regclass);


--
-- TOC entry 4876 (class 2604 OID 21973)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5126 (class 0 OID 22207)
-- Dependencies: 242
-- Data for Name: certificates; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 5112 (class 0 OID 22050)
-- Dependencies: 228
-- Data for Name: class_members; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 5106 (class 0 OID 21989)
-- Dependencies: 222
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.courses VALUES (1, 'Khóa học NestJS Cơ bản', 'Mô tả khóa học test', '', 'NEST001', false, 'DRAFT', 2, '2026-02-10 23:49:35.399584+07', '2026-02-10 23:49:35.399584+07');


--
-- TOC entry 5110 (class 0 OID 22029)
-- Dependencies: 226
-- Data for Name: lessons; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 5118 (class 0 OID 22118)
-- Dependencies: 234
-- Data for Name: options; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.options VALUES (1, 1, '@Injectable()', false);
INSERT INTO public.options VALUES (2, 1, '@Controller()', true);
INSERT INTO public.options VALUES (3, 1, '@Module()', false);
INSERT INTO public.options VALUES (4, 1, '@Service()', false);
INSERT INTO public.options VALUES (5, 2, 'app.module.ts', false);
INSERT INTO public.options VALUES (6, 2, 'main.ts', true);
INSERT INTO public.options VALUES (7, 2, 'auth.service.ts', false);
INSERT INTO public.options VALUES (24, 11, '@Injectable()', false);
INSERT INTO public.options VALUES (25, 11, '@Controller()', true);
INSERT INTO public.options VALUES (26, 11, '@Module()', false);
INSERT INTO public.options VALUES (27, 11, '@Service()', false);
INSERT INTO public.options VALUES (28, 12, 'app.module.ts', false);
INSERT INTO public.options VALUES (29, 12, 'main.ts', true);
INSERT INTO public.options VALUES (30, 12, 'auth.service.ts', false);


--
-- TOC entry 5116 (class 0 OID 22099)
-- Dependencies: 232
-- Data for Name: questions; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.questions VALUES (1, NULL, 'Decorator nào dùng để định nghĩa một Controller trong NestJS?', 10, 'SINGLE');
INSERT INTO public.questions VALUES (2, NULL, 'File nào là điểm khởi chạy chính (Entry point) của ứng dụng NestJS?', 10, 'SINGLE');
INSERT INTO public.questions VALUES (11, 4, 'Decorator nào dùng để định nghĩa một Controller trong NestJS?', 10, 'SINGLE');
INSERT INTO public.questions VALUES (12, 4, 'File nào là điểm khởi chạy chính (Entry point) của ứng dụng NestJS?', 10, 'SINGLE');


--
-- TOC entry 5114 (class 0 OID 22073)
-- Dependencies: 230
-- Data for Name: quizzes; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.quizzes VALUES (4, 'Đề thi trắc nghiệm kiến thức cơ bản về Module, Controller và Service', 45, 50, 1, NULL, 'Bài kiểm tra giữa kỳ NestJS', '2026-02-10 23:59:11.642088', '2026-02-10 23:59:11.642088');


--
-- TOC entry 5108 (class 0 OID 22013)
-- Dependencies: 224
-- Data for Name: sections; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 5122 (class 0 OID 22157)
-- Dependencies: 238
-- Data for Name: submission_answers; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 5120 (class 0 OID 22136)
-- Dependencies: 236
-- Data for Name: submissions; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 5124 (class 0 OID 22183)
-- Dependencies: 240
-- Data for Name: user_progress; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 5104 (class 0 OID 21970)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES (1, 'ADMIN', true, 'admin@gmail.com', '$2b$10$rbn497YuLB3f8ac27YiXmeiNugPPWSxCzM0J5bCwWlSV.r503FnVG', 'Admin System', NULL, '2026-02-09 15:09:15.657608', '2026-02-09 15:09:15.657608');
INSERT INTO public.users VALUES (2, 'INSTRUCTOR', true, 'teacher1@gmail.com', '$2b$10$ot9ud4HYDfvcc7Z50yN1Q.bqxv7LsqPjxb51/he7F0HArc99LPase', 'Nguyễn Văn A', NULL, '2026-02-09 15:10:53.983139', '2026-02-09 15:10:53.983139');
INSERT INTO public.users VALUES (3, 'STUDENT', true, 'student1@gmail.com', '$2b$10$sAU4C5ffnbFGSeu1gOKko.bDK1.Cm/P6VrbVWwjzEl3j2rslt8Hx.', 'Le Minh C', NULL, '2026-02-09 15:12:02.970435', '2026-02-09 15:12:02.970435');


--
-- TOC entry 5144 (class 0 OID 0)
-- Dependencies: 241
-- Name: certificates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.certificates_id_seq', 1, false);


--
-- TOC entry 5145 (class 0 OID 0)
-- Dependencies: 227
-- Name: class_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.class_members_id_seq', 1, false);


--
-- TOC entry 5146 (class 0 OID 0)
-- Dependencies: 221
-- Name: courses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.courses_id_seq', 1, false);


--
-- TOC entry 5147 (class 0 OID 0)
-- Dependencies: 225
-- Name: lessons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.lessons_id_seq', 1, false);


--
-- TOC entry 5148 (class 0 OID 0)
-- Dependencies: 233
-- Name: options_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.options_id_seq', 30, true);


--
-- TOC entry 5149 (class 0 OID 0)
-- Dependencies: 231
-- Name: questions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.questions_id_seq', 12, true);


--
-- TOC entry 5150 (class 0 OID 0)
-- Dependencies: 229
-- Name: quizzes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.quizzes_id_seq', 4, true);


--
-- TOC entry 5151 (class 0 OID 0)
-- Dependencies: 223
-- Name: sections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sections_id_seq', 1, false);


--
-- TOC entry 5152 (class 0 OID 0)
-- Dependencies: 237
-- Name: submission_answers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.submission_answers_id_seq', 1, false);


--
-- TOC entry 5153 (class 0 OID 0)
-- Dependencies: 235
-- Name: submissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.submissions_id_seq', 1, false);


--
-- TOC entry 5154 (class 0 OID 0)
-- Dependencies: 239
-- Name: user_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_progress_id_seq', 1, false);


--
-- TOC entry 5155 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- TOC entry 4909 (class 2606 OID 22233)
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- TOC entry 4939 (class 2606 OID 22219)
-- Name: certificates certificates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_pkey PRIMARY KEY (id);


--
-- TOC entry 4921 (class 2606 OID 22059)
-- Name: class_members class_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.class_members
    ADD CONSTRAINT class_members_pkey PRIMARY KEY (id);


--
-- TOC entry 4913 (class 2606 OID 22006)
-- Name: courses courses_class_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_class_code_key UNIQUE (class_code);


--
-- TOC entry 4915 (class 2606 OID 22004)
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- TOC entry 4919 (class 2606 OID 22043)
-- Name: lessons lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_pkey PRIMARY KEY (id);


--
-- TOC entry 4929 (class 2606 OID 22129)
-- Name: options options_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.options
    ADD CONSTRAINT options_pkey PRIMARY KEY (id);


--
-- TOC entry 4927 (class 2606 OID 22111)
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);


--
-- TOC entry 4925 (class 2606 OID 22087)
-- Name: quizzes quizzes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT quizzes_pkey PRIMARY KEY (id);


--
-- TOC entry 4917 (class 2606 OID 22022)
-- Name: sections sections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_pkey PRIMARY KEY (id);


--
-- TOC entry 4933 (class 2606 OID 22166)
-- Name: submission_answers submission_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submission_answers
    ADD CONSTRAINT submission_answers_pkey PRIMARY KEY (id);


--
-- TOC entry 4931 (class 2606 OID 22145)
-- Name: submissions submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_pkey PRIMARY KEY (id);


--
-- TOC entry 4923 (class 2606 OID 22061)
-- Name: class_members uq_member_user_course; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.class_members
    ADD CONSTRAINT uq_member_user_course UNIQUE (user_id, course_id);


--
-- TOC entry 4935 (class 2606 OID 22195)
-- Name: user_progress uq_progress_user_lesson; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT uq_progress_user_lesson UNIQUE (user_id, lesson_id);


--
-- TOC entry 4937 (class 2606 OID 22193)
-- Name: user_progress user_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT user_progress_pkey PRIMARY KEY (id);


--
-- TOC entry 4911 (class 2606 OID 21985)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4946 (class 2606 OID 22320)
-- Name: options FK_2bdd03245b8cb040130fe16f21d; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.options
    ADD CONSTRAINT "FK_2bdd03245b8cb040130fe16f21d" FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;


--
-- TOC entry 4945 (class 2606 OID 22315)
-- Name: questions FK_46b3c125e02f7242662e4ccb307; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT "FK_46b3c125e02f7242662e4ccb307" FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE CASCADE;


--
-- TOC entry 4949 (class 2606 OID 22290)
-- Name: submission_answers FK_5b61c511ac5f89a1a8bcffe6cc3; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submission_answers
    ADD CONSTRAINT "FK_5b61c511ac5f89a1a8bcffe6cc3" FOREIGN KEY (submission_id) REFERENCES public.submissions(id) ON DELETE CASCADE;


--
-- TOC entry 4950 (class 2606 OID 22300)
-- Name: submission_answers FK_b3c19a109f4b74d98da7e0127c7; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submission_answers
    ADD CONSTRAINT "FK_b3c19a109f4b74d98da7e0127c7" FOREIGN KEY (selected_option_id) REFERENCES public.options(id);


--
-- TOC entry 4951 (class 2606 OID 22295)
-- Name: submission_answers FK_b65dfe2c68541fe7d90e82ebf03; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submission_answers
    ADD CONSTRAINT "FK_b65dfe2c68541fe7d90e82ebf03" FOREIGN KEY (question_id) REFERENCES public.questions(id);


--
-- TOC entry 4947 (class 2606 OID 22310)
-- Name: submissions FK_f9a483997223e33e910fbdc8151; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT "FK_f9a483997223e33e910fbdc8151" FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE CASCADE;


--
-- TOC entry 4948 (class 2606 OID 22305)
-- Name: submissions FK_fca12c4ddd646dea4572c6815a9; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT "FK_fca12c4ddd646dea4572c6815a9" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4954 (class 2606 OID 22225)
-- Name: certificates fk_certificate_course; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT fk_certificate_course FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- TOC entry 4955 (class 2606 OID 22220)
-- Name: certificates fk_certificate_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT fk_certificate_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4940 (class 2606 OID 22007)
-- Name: courses fk_course_instructor; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT fk_course_instructor FOREIGN KEY (instructor_id) REFERENCES public.users(id);


--
-- TOC entry 4942 (class 2606 OID 22044)
-- Name: lessons fk_lesson_section; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT fk_lesson_section FOREIGN KEY (section_id) REFERENCES public.sections(id) ON DELETE CASCADE;


--
-- TOC entry 4943 (class 2606 OID 22067)
-- Name: class_members fk_member_course; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.class_members
    ADD CONSTRAINT fk_member_course FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- TOC entry 4944 (class 2606 OID 22062)
-- Name: class_members fk_member_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.class_members
    ADD CONSTRAINT fk_member_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4952 (class 2606 OID 22201)
-- Name: user_progress fk_progress_lesson; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT fk_progress_lesson FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;


--
-- TOC entry 4953 (class 2606 OID 22196)
-- Name: user_progress fk_progress_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT fk_progress_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4941 (class 2606 OID 22023)
-- Name: sections fk_section_course; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT fk_section_course FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;


-- Completed on 2026-02-11 00:24:24

--
-- PostgreSQL database dump complete
--
