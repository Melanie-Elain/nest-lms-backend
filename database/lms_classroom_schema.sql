-- =============================================
-- PHẦN 1: DỌN DẸP
-- =============================================
DROP TABLE IF EXISTS "certificates" CASCADE;
DROP TABLE IF EXISTS "user_progress" CASCADE;
DROP TABLE IF EXISTS "submission_answers" CASCADE;
DROP TABLE IF EXISTS "submissions" CASCADE;
DROP TABLE IF EXISTS "answers" CASCADE;
DROP TABLE IF EXISTS "questions" CASCADE;
DROP TABLE IF EXISTS "quizzes" CASCADE;
DROP TABLE IF EXISTS "class_members" CASCADE;
DROP TABLE IF EXISTS "lessons" CASCADE;
DROP TABLE IF EXISTS "sections" CASCADE;
DROP TABLE IF EXISTS "courses" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

DROP TYPE IF EXISTS "lesson_type" CASCADE;
DROP TYPE IF EXISTS "course_status" CASCADE;
DROP TYPE IF EXISTS "user_role" CASCADE;

-- =============================================
-- PHẦN 2: TẠO ENUM TYPES
-- =============================================
CREATE TYPE "user_role" AS ENUM ('ADMIN', 'INSTRUCTOR', 'STUDENT');
CREATE TYPE "course_status" AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED');
CREATE TYPE "lesson_type" AS ENUM ('VIDEO', 'DOCUMENT');

-- =============================================
-- PHẦN 3: TẠO CẤU TRÚC BẢNG (SCHEMA)
-- =============================================

-- 3.1. Users (SV1)
CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "avatar" TEXT,
    "role" "user_role" DEFAULT 'STUDENT',
    "refresh_token" TEXT,
    "is_active" BOOLEAN DEFAULT TRUE,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

-- 3.2. Courses (SV2)
CREATE TABLE "courses" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "thumbnail" TEXT,
    "class_code" VARCHAR(20) UNIQUE NOT NULL,
    "is_archived" BOOLEAN DEFAULT FALSE,
    "status" "course_status" DEFAULT 'DRAFT',
    "instructor_id" INT NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT "fk_course_instructor" FOREIGN KEY ("instructor_id") REFERENCES "users"("id")
);

-- 3.3. Sections (SV2)
CREATE TABLE "sections" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR(255) NOT NULL,
    "order" INT NOT NULL,
    "course_id" INT NOT NULL,
    CONSTRAINT "fk_section_course" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE
);

-- 3.4. Lessons (SV2)
CREATE TABLE "lessons" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR(255) NOT NULL,
    "type" "lesson_type" NOT NULL,
    "content" TEXT NOT NULL,
    "description" TEXT,
    "duration" INT DEFAULT 0,
    "order" INT NOT NULL,
    "section_id" INT NOT NULL,
    CONSTRAINT "fk_lesson_section" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE CASCADE
);

-- 3.5. Class Members (SV2)
CREATE TABLE "class_members" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INT NOT NULL,
    "course_id" INT NOT NULL,
    "joined_at" TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT "fk_member_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_member_course" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE,
    CONSTRAINT "uq_member_user_course" UNIQUE ("user_id", "course_id")
);

-- 3.6. Quizzes (SV3)
CREATE TABLE "quizzes" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "time_limit" INT NOT NULL,
    "pass_score" INT DEFAULT 50,
    "section_id" INT NOT NULL,
    CONSTRAINT "fk_quiz_section" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE CASCADE
);

-- 3.7. Questions (SV3)
CREATE TABLE "questions" (
    "id" SERIAL PRIMARY KEY,
    "quiz_id" INT NOT NULL,
    "text" TEXT NOT NULL,
    "points" INT DEFAULT 1,
    CONSTRAINT "fk_question_quiz" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE CASCADE
);

-- 3.8. Answers (SV3)
CREATE TABLE "answers" (
    "id" SERIAL PRIMARY KEY,
    "question_id" INT NOT NULL,
    "text" TEXT NOT NULL,
    "is_correct" BOOLEAN DEFAULT FALSE,
    CONSTRAINT "fk_answer_question" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE
);

-- 3.9. Submissions (SV3)
CREATE TABLE "submissions" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INT NOT NULL,
    "quiz_id" INT NOT NULL,
    "score" INT,
    "started_at" TIMESTAMPTZ DEFAULT NOW(),
    "completed_at" TIMESTAMPTZ,
    CONSTRAINT "fk_submission_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_submission_quiz" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE CASCADE
);

-- 3.10. Submission Answers (SV3)
CREATE TABLE "submission_answers" (
    "id" SERIAL PRIMARY KEY,
    "submission_id" INT NOT NULL,
    "question_id" INT NOT NULL,
    "answer_id" INT NOT NULL,
    CONSTRAINT "fk_sub_ans_submission" FOREIGN KEY ("submission_id") REFERENCES "submissions"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_sub_ans_question" FOREIGN KEY ("question_id") REFERENCES "questions"("id"),
    CONSTRAINT "fk_sub_ans_answer" FOREIGN KEY ("answer_id") REFERENCES "answers"("id")
);

-- 3.11. User Progress (Dùng chung)
CREATE TABLE "user_progress" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INT NOT NULL,
    "lesson_id" INT NOT NULL,
    "is_completed" BOOLEAN DEFAULT FALSE,
    "updated_at" TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT "fk_progress_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_progress_lesson" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE,
    CONSTRAINT "uq_progress_user_lesson" UNIQUE ("user_id", "lesson_id")
);

-- 3.12. Certificates (Dùng chung)
CREATE TABLE "certificates" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INT NOT NULL,
    "course_id" INT NOT NULL,
    "pdf_url" TEXT NOT NULL,
    "issued_at" TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT "fk_certificate_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_certificate_course" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE
);

-- =============================================
-- PHẦN 4: SEED DATA (Dữ liệu mẫu)
-- =============================================
INSERT INTO "users" ("email", "password", "full_name", "role") VALUES
('admin@gmail.com', '123456', 'Admin System', 'ADMIN'),
('teacher1@gmail.com', '123456', 'Nguyen Van A', 'INSTRUCTOR'),
('student1@gmail.com', '123456', 'Le Minh C', 'STUDENT');

INSERT INTO "courses" ("title", "description", "class_code", "status", "instructor_id") VALUES
('Lập trình NestJS', 'Khóa học NestJS từ A-Z', 'NEST01', 'PUBLISHED', 2),
('ReactJS cơ bản', 'Frontend với ReactJS', 'REACT01', 'PUBLISHED', 2);