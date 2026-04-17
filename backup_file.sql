--
-- PostgreSQL database dump
--

\restrict 7iWRLVuzpmAaeTe70BxyMqHIx4a4YLRUnu8FxZuT0wkl8ulpxWLANKwOR13IZhj

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

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
-- Name: lessons_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.lessons_type_enum AS ENUM (
    'video',
    'pdf',
    'pptx',
    'docx'
);


ALTER TYPE public.lessons_type_enum OWNER TO postgres;

--
-- Name: questions_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.questions_type_enum AS ENUM (
    'SINGLE',
    'MULTIPLE'
);


ALTER TYPE public.questions_type_enum OWNER TO postgres;

--
-- Name: users_role_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.users_role_enum AS ENUM (
    'ADMIN',
    'INSTRUCTOR',
    'STUDENT'
);


ALTER TYPE public.users_role_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: certificates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.certificates (
    id integer NOT NULL,
    user_id integer NOT NULL,
    course_id integer NOT NULL,
    pdf_url text NOT NULL,
    issued_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.certificates OWNER TO postgres;

--
-- Name: certificates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.certificates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.certificates_id_seq OWNER TO postgres;

--
-- Name: certificates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.certificates_id_seq OWNED BY public.certificates.id;


--
-- Name: class_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.class_members (
    id integer NOT NULL,
    user_id integer NOT NULL,
    course_id integer NOT NULL,
    joined_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.class_members OWNER TO postgres;

--
-- Name: class_members_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.class_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.class_members_id_seq OWNER TO postgres;

--
-- Name: class_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.class_members_id_seq OWNED BY public.class_members.id;


--
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.courses (
    id integer NOT NULL,
    description text,
    price integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "instructorId" integer NOT NULL,
    title character varying NOT NULL,
    thumbnail character varying
);


ALTER TABLE public.courses OWNER TO postgres;

--
-- Name: courses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.courses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.courses_id_seq OWNER TO postgres;

--
-- Name: courses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.courses_id_seq OWNED BY public.courses.id;


--
-- Name: lesson_progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lesson_progress (
    id integer NOT NULL,
    user_id integer NOT NULL,
    lesson_id integer NOT NULL,
    is_completed boolean DEFAULT false NOT NULL,
    completed_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.lesson_progress OWNER TO postgres;

--
-- Name: lesson_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lesson_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lesson_progress_id_seq OWNER TO postgres;

--
-- Name: lesson_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lesson_progress_id_seq OWNED BY public.lesson_progress.id;


--
-- Name: lessons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lessons (
    id integer NOT NULL,
    type public.lessons_type_enum DEFAULT 'video'::public.lessons_type_enum NOT NULL,
    content text,
    description text,
    duration integer,
    "order" integer DEFAULT 0 NOT NULL,
    section_id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.lessons OWNER TO postgres;

--
-- Name: lessons_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lessons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lessons_id_seq OWNER TO postgres;

--
-- Name: lessons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lessons_id_seq OWNED BY public.lessons.id;


--
-- Name: options; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.options (
    id integer NOT NULL,
    question_id integer,
    content text NOT NULL,
    is_correct boolean DEFAULT false NOT NULL
);


ALTER TABLE public.options OWNER TO postgres;

--
-- Name: options_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.options_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.options_id_seq OWNER TO postgres;

--
-- Name: options_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.options_id_seq OWNED BY public.options.id;


--
-- Name: questions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.questions (
    id integer NOT NULL,
    quiz_id integer,
    content text NOT NULL,
    points integer DEFAULT 1 NOT NULL,
    type public.questions_type_enum DEFAULT 'SINGLE'::public.questions_type_enum NOT NULL
);


ALTER TABLE public.questions OWNER TO postgres;

--
-- Name: questions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.questions_id_seq OWNER TO postgres;

--
-- Name: questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.questions_id_seq OWNED BY public.questions.id;


--
-- Name: quizzes; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.quizzes OWNER TO postgres;

--
-- Name: quizzes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.quizzes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quizzes_id_seq OWNER TO postgres;

--
-- Name: quizzes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.quizzes_id_seq OWNED BY public.quizzes.id;


--
-- Name: section_progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.section_progress (
    id integer NOT NULL,
    user_id integer NOT NULL,
    section_id integer NOT NULL,
    is_completed boolean DEFAULT false NOT NULL,
    completed_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.section_progress OWNER TO postgres;

--
-- Name: section_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.section_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.section_progress_id_seq OWNER TO postgres;

--
-- Name: section_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.section_progress_id_seq OWNED BY public.section_progress.id;


--
-- Name: sections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sections (
    id integer NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "courseId" integer CONSTRAINT sections_course_id_not_null NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.sections OWNER TO postgres;

--
-- Name: sections_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sections_id_seq OWNER TO postgres;

--
-- Name: sections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sections_id_seq OWNED BY public.sections.id;


--
-- Name: submission_answers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.submission_answers (
    id integer NOT NULL,
    submission_id integer NOT NULL,
    question_id integer NOT NULL,
    selected_option_id integer NOT NULL,
    is_correct boolean DEFAULT false NOT NULL
);


ALTER TABLE public.submission_answers OWNER TO postgres;

--
-- Name: submission_answers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.submission_answers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.submission_answers_id_seq OWNER TO postgres;

--
-- Name: submission_answers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.submission_answers_id_seq OWNED BY public.submission_answers.id;


--
-- Name: submissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.submissions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    quiz_id integer NOT NULL,
    score numeric(5,2),
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    completed_at timestamp with time zone
);


ALTER TABLE public.submissions OWNER TO postgres;

--
-- Name: submissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.submissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.submissions_id_seq OWNER TO postgres;

--
-- Name: submissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.submissions_id_seq OWNED BY public.submissions.id;


--
-- Name: user_progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_progress (
    id integer NOT NULL,
    user_id integer NOT NULL,
    lesson_id integer NOT NULL,
    is_completed boolean DEFAULT false,
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.user_progress OWNER TO postgres;

--
-- Name: user_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_progress_id_seq OWNER TO postgres;

--
-- Name: user_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_progress_id_seq OWNED BY public.user_progress.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    role public.users_role_enum DEFAULT 'STUDENT'::public.users_role_enum NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    full_name character varying,
    avatar character varying,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: certificates id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates ALTER COLUMN id SET DEFAULT nextval('public.certificates_id_seq'::regclass);


--
-- Name: class_members id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class_members ALTER COLUMN id SET DEFAULT nextval('public.class_members_id_seq'::regclass);


--
-- Name: courses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses ALTER COLUMN id SET DEFAULT nextval('public.courses_id_seq'::regclass);


--
-- Name: lesson_progress id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson_progress ALTER COLUMN id SET DEFAULT nextval('public.lesson_progress_id_seq'::regclass);


--
-- Name: lessons id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons ALTER COLUMN id SET DEFAULT nextval('public.lessons_id_seq'::regclass);


--
-- Name: options id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.options ALTER COLUMN id SET DEFAULT nextval('public.options_id_seq'::regclass);


--
-- Name: questions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions ALTER COLUMN id SET DEFAULT nextval('public.questions_id_seq'::regclass);


--
-- Name: quizzes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quizzes ALTER COLUMN id SET DEFAULT nextval('public.quizzes_id_seq'::regclass);


--
-- Name: section_progress id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.section_progress ALTER COLUMN id SET DEFAULT nextval('public.section_progress_id_seq'::regclass);


--
-- Name: sections id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sections ALTER COLUMN id SET DEFAULT nextval('public.sections_id_seq'::regclass);


--
-- Name: submission_answers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submission_answers ALTER COLUMN id SET DEFAULT nextval('public.submission_answers_id_seq'::regclass);


--
-- Name: submissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submissions ALTER COLUMN id SET DEFAULT nextval('public.submissions_id_seq'::regclass);


--
-- Name: user_progress id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progress ALTER COLUMN id SET DEFAULT nextval('public.user_progress_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: certificates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.certificates (id, user_id, course_id, pdf_url, issued_at) FROM stdin;
2	3	1	https://lms-sgu.vn/view-cert/3-1	2026-04-17 01:05:32.698+07
\.


--
-- Data for Name: class_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.class_members (id, user_id, course_id, joined_at) FROM stdin;
1	3	4	2026-03-29 19:52:24.221559
2	3	5	2026-03-29 19:54:05.630186
3	3	6	2026-03-29 20:17:39.516968
4	3	7	2026-03-29 20:30:05.078167
5	3	8	2026-03-29 20:32:44.052074
6	3	9	2026-03-29 20:37:46.36419
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.courses (id, description, price, "createdAt", "updatedAt", "instructorId", title, thumbnail) FROM stdin;
1	Khóa học dành cho người mới bắt đầu	199000	2026-03-22 22:19:50.38287	2026-03-22 22:19:50.38287	1	Lập trình NestJS cơ bản	https://image.com/thumb.png
2	Khóa học dành cho người mới bắt đầu	199000	2026-03-29 19:41:39.711035	2026-03-29 19:41:39.711035	2	Lập trình NestJS cơ bản	https://image.com/thumb.png
3	Khóa học dành cho người mới bắt đầu	199000	2026-03-29 19:47:04.244446	2026-03-29 19:47:04.244446	2	Lập trình NestJS cơ bản	https://image.com/thumb.png
4	Khóa học dành cho người mới bắt đầu	199000	2026-03-29 19:52:23.486152	2026-03-29 19:52:23.486152	2	Lập trình NestJS cơ bản	https://image.com/thumb.png
5	Khóa học dành cho người mới bắt đầu	199000	2026-03-29 19:54:05.034509	2026-03-29 19:54:05.034509	2	Lập trình NestJS cơ bản	https://image.com/thumb.png
6	Khóa học dành cho người mới bắt đầu	199000	2026-03-29 20:17:38.857652	2026-03-29 20:17:38.857652	2	Lập trình NestJS cơ bản	https://image.com/thumb.png
7	Khóa học dành cho người mới bắt đầu	199000	2026-03-29 20:30:04.458032	2026-03-29 20:30:04.458032	2	Lập trình NestJS cơ bản	https://image.com/thumb.png
8	Khóa học dành cho người mới bắt đầu	199000	2026-03-29 20:32:43.512247	2026-03-29 20:32:43.512247	2	Lập trình NestJS cơ bản	https://image.com/thumb.png
9	Khóa học dành cho người mới bắt đầu	199000	2026-03-29 20:37:45.755498	2026-03-29 20:37:45.755498	2	Lập trình NestJS cơ bản	https://image.com/thumb.png
\.


--
-- Data for Name: lesson_progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lesson_progress (id, user_id, lesson_id, is_completed, completed_at) FROM stdin;
1	5	1	t	2026-03-22 22:21:40.853841
2	5	2	t	2026-03-24 15:55:55.370897
4	3	3	t	2026-04-17 00:40:28.978284
5	3	1	t	2026-04-17 00:45:47.622051
6	3	2	t	2026-04-17 00:45:51.301046
\.


--
-- Data for Name: lessons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lessons (id, type, content, description, duration, "order", section_id, title) FROM stdin;
1	video	https://youtube.com/...	Mô tả ngắn về bài học	300	1	1	Bài 1: Cài đặt môi trường
2	video	https://youtube.com/...	Mô tả ngắn về bài học	300	1	1	Bài 1: Cài đặt môi trường
3	video	https://youtube.com/...	Mô tả ngắn về bài học	300	1	2	Bài 1: Cài đặt môi trường
\.


--
-- Data for Name: options; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.options (id, question_id, content, is_correct) FROM stdin;
1	1	@Injectable()	f
2	1	@Controller()	t
3	1	@Module()	f
4	1	@Service()	f
5	2	app.module.ts	f
6	2	main.ts	t
7	2	auth.service.ts	f
24	11	@Injectable()	f
25	11	@Controller()	t
26	11	@Module()	f
27	11	@Service()	f
28	12	app.module.ts	f
29	12	main.ts	t
30	12	auth.service.ts	f
36	15	@Injectable()	t
37	15	@Controller()	f
38	16	Express	t
39	16	Koa	f
40	17	nest g co	t
41	17	nest g mo	f
42	18	Express	t
43	18	Koa	f
44	19	nest g co	t
45	19	nest g mo	f
46	20	Express	t
47	20	Koa	f
48	21	nest g co	t
49	21	nest g mo	f
50	22	Bằng 2	t
51	22	Bằng 3	f
52	23	TypeScript	t
53	23	PHP	f
54	24	@Injectable()	f
55	24	@Controller()	t
56	24	@Module()	f
57	25	TypeScript	t
58	25	PHP	f
59	26	@Injectable()	f
60	26	@Controller()	t
61	26	@Module()	f
62	27	@Injectable()	t
63	27	@Controller()	f
64	28	@Injectable()	t
65	28	@Controller()	f
66	29	@Injectable()	t
67	29	@Controller()	f
68	30	@Injectable()	t
69	30	@Controller()	f
70	31	@Injectable()	t
71	31	@Controller()	f
72	32	@Injectable()	t
73	32	@Controller()	f
74	33	@Injectable()	t
75	33	@Controller()	f
76	34	TypeScript	t
77	34	PHP	f
78	35	@Injectable()	f
79	35	@Controller()	t
80	35	@Module()	f
81	36	TypeScript	t
82	36	PHP	f
83	37	@Injectable()	f
84	37	@Controller()	t
85	37	@Module()	f
\.


--
-- Data for Name: questions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.questions (id, quiz_id, content, points, type) FROM stdin;
1	\N	Decorator nào dùng để định nghĩa một Controller trong NestJS?	10	SINGLE
2	\N	File nào là điểm khởi chạy chính (Entry point) của ứng dụng NestJS?	10	SINGLE
11	4	Decorator nào dùng để định nghĩa một Controller trong NestJS?	10	SINGLE
12	4	File nào là điểm khởi chạy chính (Entry point) của ứng dụng NestJS?	10	SINGLE
15	\N	Decorator nào đánh dấu một class là Injectable?	5	SINGLE
16	\N	NestJS được xây dựng dựa trên framework nào?	10	SINGLE
17	\N	Lệnh nào dùng để tạo nhanh một Controller trong NestJS?	10	SINGLE
18	4	NestJS được xây dựng dựa trên framework nào?	10	SINGLE
19	4	Lệnh nào dùng để tạo nhanh một Controller trong NestJS?	10	SINGLE
20	5	NestJS được xây dựng dựa trên framework nào?	10	SINGLE
21	5	Lệnh nào dùng để tạo nhanh một Controller trong NestJS?	10	SINGLE
22	9	1 + 1 bằng mấy?	10	SINGLE
23	10	NestJS sử dụng ngôn ngữ lập trình nào làm mặc định?	10	SINGLE
24	10	Đâu là decorator dùng để đánh dấu một class là Controller trong NestJS?	10	SINGLE
25	11	NestJS sử dụng ngôn ngữ lập trình nào làm mặc định?	10	SINGLE
26	11	Đâu là decorator dùng để đánh dấu một class là Controller trong NestJS?	10	SINGLE
27	\N	Decorator nào đánh dấu một class là Injectable?	5	SINGLE
28	\N	Decorator nào đánh dấu một class là Injectable?	5	SINGLE
29	\N	Decorator nào đánh dấu một class là Injectable?	5	SINGLE
30	\N	Decorator nào đánh dấu một class là Injectable?	5	SINGLE
31	\N	Decorator nào đánh dấu một class là Injectable?	5	SINGLE
32	\N	Decorator nào đánh dấu một class là Injectable?	5	SINGLE
33	\N	Decorator nào đánh dấu một class là Injectable?	5	SINGLE
34	12	NestJS sử dụng ngôn ngữ lập trình nào làm mặc định?	10	SINGLE
35	12	Đâu là decorator dùng để đánh dấu một class là Controller trong NestJS?	10	SINGLE
36	13	NestJS sử dụng ngôn ngữ lập trình nào làm mặc định?	10	SINGLE
37	13	Đâu là decorator dùng để đánh dấu một class là Controller trong NestJS?	10	SINGLE
\.


--
-- Data for Name: quizzes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quizzes (id, description, time_limit, pass_score, course_id, section_id, title, created_at, updated_at) FROM stdin;
6	Kiểm tra kiến thức cơ bản về Module, Controller và Service	45	50	1	\N	Thi cuối kì	2026-02-11 22:15:01.986055	2026-02-11 22:15:01.986055
8	Đề thi này được kéo câu hỏi từ Ngân hàng	45	50	1	\N	Bài Test giữa kỳ NestJS	2026-03-13 23:34:29.445208	2026-03-13 23:34:29.445208
9	\N	45	8	1	\N	Bài test chuẩn chỉnh	2026-03-14 00:17:22.848648	2026-03-14 00:17:22.848648
4	Đề thi trắc nghiệm kiến thức cơ bản về Module, Controller và Service	5	50	1	\N	Bài kiểm tra giữa kỳ NestJS	2026-02-10 23:59:11.642088	2026-03-16 10:29:16.337033
5	Kiểm tra kiến thức cơ bản về Module, Controller và Service	5	50	1	\N	Bài kiểm tra Giữa kỳ NestJS	2026-02-11 22:14:08.034389	2026-03-16 10:57:49.280849
10	Bài kiểm tra gồm các câu hỏi trắc nghiệm cơ bản về framework NestJS.	15	20	1	\N	Bài kiểm tra đầu vào NestJS	2026-03-20 11:57:49.287157	2026-03-20 11:57:49.287157
11	Bài kiểm tra gồm các câu hỏi trắc nghiệm cơ bản về framework NestJS.	15	20	1	1	Bài kiểm tra đầu vào NestJS	2026-03-24 15:57:58.193733	2026-03-24 15:57:58.193733
12	Bài kiểm tra gồm các câu hỏi trắc nghiệm cơ bản về framework NestJS.	15	20	9	6	Bài kiểm tra đầu vào NestJS	2026-03-29 20:37:46.093156	2026-03-29 20:37:46.093156
13	Bài kiểm tra gồm các câu hỏi trắc nghiệm cơ bản về framework NestJS.	15	20	1	2	Bài kiểm tra đầu vào NestJS	2026-04-16 23:57:47.022445	2026-04-16 23:57:47.022445
\.


--
-- Data for Name: section_progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.section_progress (id, user_id, section_id, is_completed, completed_at) FROM stdin;
1	5	1	t	2026-03-26 12:01:30.867
2	3	2	t	2026-04-17 00:41:14.289
5	3	1	t	2026-04-17 01:05:32.67
\.


--
-- Data for Name: sections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sections (id, "order", "courseId", title) FROM stdin;
1	1	1	Chương 1: Tổng quan về Hệ thống
2	1	1	Chương 1: Tổng quan về Hệ thống
\.


--
-- Data for Name: submission_answers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.submission_answers (id, submission_id, question_id, selected_option_id, is_correct) FROM stdin;
1	1	1	2	f
3	4	11	25	f
4	4	12	29	f
5	5	11	25	f
6	5	12	29	f
33	29	25	57	t
34	29	26	60	t
41	35	36	81	t
42	35	37	84	t
49	39	25	57	t
50	39	26	60	t
\.


--
-- Data for Name: submissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.submissions (id, user_id, quiz_id, score, started_at, completed_at) FROM stdin;
1	1	4	0.00	2026-03-10 10:41:54.028252+07	2026-03-10 10:41:54.027+07
4	3	4	20.00	2026-03-16 10:41:28.92629+07	2026-03-16 10:50:17.019+07
5	5	4	20.00	2026-03-16 10:56:00.778323+07	2026-03-16 10:56:13.749+07
6	3	5	\N	2026-03-16 10:58:34.524526+07	\N
7	3	9	0.00	2026-03-17 20:18:44.29452+07	2026-03-17 20:19:10.521+07
8	3	8	0.00	2026-03-17 20:37:34.553378+07	2026-03-17 20:37:47.445+07
9	5	9	0.00	2026-03-17 20:40:07.09181+07	2026-03-17 20:40:19.661+07
13	3	6	0.00	2026-03-17 21:03:51.962407+07	2026-03-17 21:04:29.354+07
29	5	11	20.00	2026-03-26 12:01:25.033037+07	2026-03-26 12:01:30.801+07
32	3	12	0.00	2026-03-29 20:37:46.703001+07	2026-03-29 20:37:46.86+07
34	3	13	\N	2026-04-17 00:37:55.235063+07	\N
35	3	13	20.00	2026-04-17 00:40:34.500036+07	2026-04-17 00:41:14.136+07
39	3	11	20.00	2026-04-17 01:05:26.347767+07	2026-04-17 01:05:32.6+07
\.


--
-- Data for Name: user_progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_progress (id, user_id, lesson_id, is_completed, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, role, is_active, email, password, full_name, avatar, created_at, updated_at) FROM stdin;
1	ADMIN	t	admin@gmail.com	$2b$10$rbn497YuLB3f8ac27YiXmeiNugPPWSxCzM0J5bCwWlSV.r503FnVG	Admin System	\N	2026-02-09 15:09:15.657608	2026-02-09 15:09:15.657608
4	ADMIN	t	admin1@gmail.com	$2b$10$x1LgAcIgPF72TIdHn3GHlucaVs4ADdCjmRnt0gxXEB5W5.9P7z2b2	Nguyen Van B	\N	2026-03-12 21:38:25.165807	2026-03-12 21:38:25.165807
3	STUDENT	t	nguyenthithanhhangqn2004@gmail.com	$2b$10$sAU4C5ffnbFGSeu1gOKko.bDK1.Cm/P6VrbVWwjzEl3j2rslt8Hx.	Le Minh C	\N	2026-02-09 15:12:02.970435	2026-02-09 15:12:02.970435
5	STUDENT	t	student1@gmail.com	$2b$10$FPDFxqHE65y37OdEYt4.PeAcNznjD3yxMMQQzdIRghZ19XimafT0W	Nguyen Van A	\N	2026-03-16 10:55:10.931287	2026-03-16 10:55:10.931287
6	INSTRUCTOR	t	giaovien1@gmail.com	$2b$10$DZFv8Y43rnd./GV9fzmPmeeX6rvGxeMr325UbAbbzO5u0DZdWU79.	\N	\N	2026-03-29 19:41:37.806293	2026-03-29 19:41:37.806293
7	STUDENT	t	sinhvien3@gmail.com	$2b$10$i4z3BjQx1ViA37Ej3Y8gNO8WgIHfOx6.GqcoVrUocAthmzPbpOHum	\N	\N	2026-03-29 19:41:38.206551	2026-03-29 19:41:38.206551
10	INSTRUCTOR	t	teacher2@gmail.com	$2b$10$eddpYnA7HTqQ7H1rOC0Q3.HeNhEOTCkxJ4Y0DtVVmmlQLdKbz8Fzm	\N	\N	2026-03-29 19:54:03.219068	2026-03-29 19:54:03.219068
11	STUDENT	t	sinhvien4@gmail.com	$2b$10$YqzqkvDFYq8atnz3hW9frOPwZ/ebuUwsfJkjRDyhPVeDBED441UBO	\N	\N	2026-03-29 19:54:03.53946	2026-03-29 19:54:03.53946
2	INSTRUCTOR	t	teacher1@gmail.com	$2b$10$ot9ud4HYDfvcc7Z50yN1Q.bqxv7LsqPjxb51/he7F0HArc99LPase	Nguyễn Văn A	https://example.com/avatar.jpg	2026-02-09 15:10:53.983139	2026-03-29 20:17:38.371046
14	INSTRUCTOR	t	teacher3@gmail.com	$2b$10$71NDOZAYekuLkfR/34MqL.cAJXfaU.3V.KeGBDiUcZbyy6plPZGAO	\N	\N	2026-03-29 20:30:02.682332	2026-03-29 20:30:02.682332
15	STUDENT	t	sinhvien5@gmail.com	$2b$10$wWb7eCQnWsv9pu1IJfyGMuHXvmTUlWnMiFrvjWPB207ggeQawq7qm	\N	\N	2026-03-29 20:30:03.015336	2026-03-29 20:30:03.015336
18	INSTRUCTOR	t	teacher4@gmail.com	$2b$10$.eIukyp4u1tY5tE85QjfYOzERGJSU2ET0cHp8OnXAmfF4OUDSWR2q	\N	\N	2026-03-29 20:37:43.989081	2026-03-29 20:37:43.989081
19	STUDENT	t	sinhvien6@gmail.com	$2b$10$Sx7/QbGn0L08cy2suyXrxewOlIqYLpT.4snovuB2N7bLYrYaJznHS	\N	\N	2026-03-29 20:37:44.323331	2026-03-29 20:37:44.323331
\.


--
-- Name: certificates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.certificates_id_seq', 2, true);


--
-- Name: class_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.class_members_id_seq', 6, true);


--
-- Name: courses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.courses_id_seq', 9, true);


--
-- Name: lesson_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lesson_progress_id_seq', 6, true);


--
-- Name: lessons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lessons_id_seq', 7, true);


--
-- Name: options_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.options_id_seq', 85, true);


--
-- Name: questions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.questions_id_seq', 37, true);


--
-- Name: quizzes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.quizzes_id_seq', 13, true);


--
-- Name: section_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.section_progress_id_seq', 5, true);


--
-- Name: sections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sections_id_seq', 6, true);


--
-- Name: submission_answers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.submission_answers_id_seq', 50, true);


--
-- Name: submissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.submissions_id_seq', 39, true);


--
-- Name: user_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_progress_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 19, true);


--
-- Name: section_progress PK_03eb35e065e5e6580d7530e6faf; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.section_progress
    ADD CONSTRAINT "PK_03eb35e065e5e6580d7530e6faf" PRIMARY KEY (id);


--
-- Name: lesson_progress PK_e6223ebbc5f8f5fce40e0193de1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson_progress
    ADD CONSTRAINT "PK_e6223ebbc5f8f5fce40e0193de1" PRIMARY KEY (id);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: certificates certificates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_pkey PRIMARY KEY (id);


--
-- Name: class_members class_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class_members
    ADD CONSTRAINT class_members_pkey PRIMARY KEY (id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: lessons lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_pkey PRIMARY KEY (id);


--
-- Name: options options_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.options
    ADD CONSTRAINT options_pkey PRIMARY KEY (id);


--
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);


--
-- Name: quizzes quizzes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT quizzes_pkey PRIMARY KEY (id);


--
-- Name: sections sections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_pkey PRIMARY KEY (id);


--
-- Name: submission_answers submission_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submission_answers
    ADD CONSTRAINT submission_answers_pkey PRIMARY KEY (id);


--
-- Name: submissions submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_pkey PRIMARY KEY (id);


--
-- Name: user_progress uq_progress_user_lesson; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT uq_progress_user_lesson UNIQUE (user_id, lesson_id);


--
-- Name: user_progress user_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT user_progress_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: sections FK_0fc0dc8ce98e7dc47c273f85e3d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT "FK_0fc0dc8ce98e7dc47c273f85e3d" FOREIGN KEY ("courseId") REFERENCES public.courses(id) ON DELETE CASCADE;


--
-- Name: lessons FK_19261e484ffd22b40ea596ece4d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT "FK_19261e484ffd22b40ea596ece4d" FOREIGN KEY (section_id) REFERENCES public.sections(id) ON DELETE CASCADE;


--
-- Name: class_members FK_21a763bf07cdd4d45c2db79fa95; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class_members
    ADD CONSTRAINT "FK_21a763bf07cdd4d45c2db79fa95" FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- Name: options FK_2bdd03245b8cb040130fe16f21d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.options
    ADD CONSTRAINT "FK_2bdd03245b8cb040130fe16f21d" FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;


--
-- Name: class_members FK_4569afaf85946abfa3c9cbac1a6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class_members
    ADD CONSTRAINT "FK_4569afaf85946abfa3c9cbac1a6" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: questions FK_46b3c125e02f7242662e4ccb307; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT "FK_46b3c125e02f7242662e4ccb307" FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE CASCADE;


--
-- Name: submission_answers FK_5b61c511ac5f89a1a8bcffe6cc3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submission_answers
    ADD CONSTRAINT "FK_5b61c511ac5f89a1a8bcffe6cc3" FOREIGN KEY (submission_id) REFERENCES public.submissions(id) ON DELETE CASCADE;


--
-- Name: lesson_progress FK_980e74721039ebe210fee2eeca2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson_progress
    ADD CONSTRAINT "FK_980e74721039ebe210fee2eeca2" FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;


--
-- Name: submission_answers FK_b3c19a109f4b74d98da7e0127c7; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submission_answers
    ADD CONSTRAINT "FK_b3c19a109f4b74d98da7e0127c7" FOREIGN KEY (selected_option_id) REFERENCES public.options(id);


--
-- Name: submission_answers FK_b65dfe2c68541fe7d90e82ebf03; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submission_answers
    ADD CONSTRAINT "FK_b65dfe2c68541fe7d90e82ebf03" FOREIGN KEY (question_id) REFERENCES public.questions(id);


--
-- Name: section_progress FK_d2e8a8b431afd1f807aed67bcb0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.section_progress
    ADD CONSTRAINT "FK_d2e8a8b431afd1f807aed67bcb0" FOREIGN KEY (section_id) REFERENCES public.sections(id) ON DELETE CASCADE;


--
-- Name: courses FK_e6714597bea722629fa7d32124a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT "FK_e6714597bea722629fa7d32124a" FOREIGN KEY ("instructorId") REFERENCES public.users(id);


--
-- Name: submissions FK_f9a483997223e33e910fbdc8151; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT "FK_f9a483997223e33e910fbdc8151" FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE CASCADE;


--
-- Name: submissions FK_fca12c4ddd646dea4572c6815a9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT "FK_fca12c4ddd646dea4572c6815a9" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_progress fk_progress_lesson; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT fk_progress_lesson FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;


--
-- Name: user_progress fk_progress_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT fk_progress_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 7iWRLVuzpmAaeTe70BxyMqHIx4a4YLRUnu8FxZuT0wkl8ulpxWLANKwOR13IZhj

