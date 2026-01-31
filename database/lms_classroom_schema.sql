-- =============================================
-- PHẦN 1: DỌN DẸP & TẠO CẤU TRÚC (SCHEMA)
-- =============================================

-- 1.1. Xóa bảng cũ nếu tồn tại (để chạy lại nhiều lần không lỗi)
DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS submission_answers CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS answers CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS quizzes CASCADE;
DROP TABLE IF EXISTS class_members CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS sections CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS lesson_type CASCADE;
DROP TYPE IF EXISTS course_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- 1.2. Tạo ENUM Types
CREATE TYPE user_role AS ENUM ('ADMIN', 'INSTRUCTOR', 'STUDENT');
CREATE TYPE course_status AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED');
CREATE TYPE lesson_type AS ENUM ('VIDEO', 'DOCUMENT');

-- 1.3. Tạo các Bảng
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar TEXT,
    role user_role DEFAULT 'STUDENT',
    refresh_token TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail TEXT,
    class_code VARCHAR(20) UNIQUE NOT NULL,
    is_archived BOOLEAN DEFAULT FALSE,
    status course_status DEFAULT 'DRAFT',
    instructor_id INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_course_instructor FOREIGN KEY (instructor_id) REFERENCES users(id)
);

CREATE TABLE sections (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    "order" INT NOT NULL,
    course_id INT NOT NULL,
    CONSTRAINT fk_section_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type lesson_type NOT NULL,
    content TEXT NOT NULL,
    description TEXT,
    duration INT DEFAULT 0,
    "order" INT NOT NULL,
    section_id INT NOT NULL,
    CONSTRAINT fk_lesson_section FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
);

CREATE TABLE class_members (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_member_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_member_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT uq_member_user_course UNIQUE (user_id, course_id)
);

CREATE TABLE quizzes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    time_limit INT NOT NULL,
    pass_score INT DEFAULT 50,
    section_id INT NOT NULL,
    CONSTRAINT fk_quiz_section FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
);

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    quiz_id INT NOT NULL,
    text TEXT NOT NULL,
    points INT DEFAULT 1,
    CONSTRAINT fk_question_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

CREATE TABLE answers (
    id SERIAL PRIMARY KEY,
    question_id INT NOT NULL,
    text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_answer_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    quiz_id INT NOT NULL,
    score INT,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    CONSTRAINT fk_submission_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_submission_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

CREATE TABLE submission_answers (
    id SERIAL PRIMARY KEY,
    submission_id INT NOT NULL,
    question_id INT NOT NULL,
    answer_id INT NOT NULL,
    CONSTRAINT fk_sub_ans_submission FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
    CONSTRAINT fk_sub_ans_question FOREIGN KEY (question_id) REFERENCES questions(id),
    CONSTRAINT fk_sub_ans_answer FOREIGN KEY (answer_id) REFERENCES answers(id)
);

CREATE TABLE user_progress (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    lesson_id INT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_progress_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_progress_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    CONSTRAINT uq_progress_user_lesson UNIQUE (user_id, lesson_id)
);

CREATE TABLE certificates (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    pdf_url TEXT NOT NULL,
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_certificate_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_certificate_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- =============================================
-- PHẦN 2: THÊM DỮ LIỆU MẪU (SEED DATA)
-- =============================================

-- 2.1 USERS
INSERT INTO users (email, password, full_name, role)
VALUES
('admin@gmail.com', 'hashed_admin_pass', 'Admin System', 'ADMIN'),
('teacher1@gmail.com', 'hashed_teacher_pass', 'Nguyen Van A', 'INSTRUCTOR'),
('teacher2@gmail.com', 'hashed_teacher_pass', 'Tran Thi B', 'INSTRUCTOR'),
('student1@gmail.com', 'hashed_student_pass', 'Le Minh C', 'STUDENT'),
('student2@gmail.com', 'hashed_student_pass', 'Pham Thi D', 'STUDENT'),
('student3@gmail.com', 'hashed_student_pass', 'Vo Quang E', 'STUDENT');

-- 2.2 COURSES
INSERT INTO courses (title, description, class_code, status, instructor_id)
VALUES
('Lập trình Java cơ bản', 'Khóa học Java từ cơ bản đến nâng cao', 'JAVA01', 'PUBLISHED', 2),
('Spring Boot nâng cao', 'Xây dựng backend với Spring Boot', 'SPRING01', 'PUBLISHED', 2),
('ReactJS cơ bản', 'Frontend với ReactJS', 'REACT01', 'PUBLISHED', 3);

-- 2.3 SECTIONS
INSERT INTO sections (title, "order", course_id)
VALUES
('Giới thiệu', 1, 1),
('Cú pháp cơ bản', 2, 1),
('Spring Boot Core', 1, 2),
('REST API', 2, 2),
('React cơ bản', 1, 3),
('Hook & Component', 2, 3);

-- 2.4 LESSONS
INSERT INTO lessons (title, type, content, "order", section_id)
VALUES
('Giới thiệu Java', 'VIDEO', 'https://video/java_intro.mp4', 1, 1),
('Cài đặt JDK', 'DOCUMENT', 'https://docs/java_install.pdf', 2, 1),
('Biến và kiểu dữ liệu', 'VIDEO', 'https://video/java_variable.mp4', 1, 2),
('Toán tử', 'VIDEO', 'https://video/java_operator.mp4', 2, 2),
('Giới thiệu Spring Boot', 'VIDEO', 'https://video/spring_intro.mp4', 1, 3),
('Cấu trúc project', 'DOCUMENT', 'https://docs/spring_structure.pdf', 2, 3),
('Tạo REST API', 'VIDEO', 'https://video/spring_rest.mp4', 1, 4),
('Giới thiệu React', 'VIDEO', 'https://video/react_intro.mp4', 1, 5),
('JSX và Component', 'VIDEO', 'https://video/react_component.mp4', 2, 5),
('useState & useEffect', 'VIDEO', 'https://video/react_hooks.mp4', 1, 6);

-- 2.5 CLASS MEMBERS
INSERT INTO class_members (user_id, course_id)
VALUES
(4, 1), (5, 1), (6, 1),
(4, 2), (5, 3);

-- 2.6 QUIZZES
INSERT INTO quizzes (title, description, time_limit, section_id)
VALUES
('Quiz Java cơ bản', 'Bài kiểm tra Java', 15, 2),
('Quiz Spring Boot', 'Bài kiểm tra Spring', 20, 4),
('Quiz ReactJS', 'Bài kiểm tra React', 15, 6);

-- 2.7 QUESTIONS
INSERT INTO questions (quiz_id, text, points)
VALUES
(1, 'Java là gì?', 1),
(1, 'Kiểu dữ liệu int dùng để làm gì?', 1),
(2, 'Spring Boot dùng để làm gì?', 1),
(3, 'React là thư viện hay framework?', 1);

-- 2.8 ANSWERS
INSERT INTO answers (question_id, text, is_correct)
VALUES
(1, 'Ngôn ngữ lập trình', TRUE), (1, 'Hệ điều hành', FALSE),
(2, 'Lưu số nguyên', TRUE), (2, 'Lưu chuỗi', FALSE),
(3, 'Xây dựng backend Java', TRUE), (3, 'Thiết kế đồ họa', FALSE),
(4, 'Thư viện JavaScript', TRUE), (4, 'Hệ điều hành', FALSE);

-- 2.9 SUBMISSIONS
INSERT INTO submissions (user_id, quiz_id, score)
VALUES
(4, 1, 80), (5, 1, 60), (4, 2, 90);

-- 2.10 SUBMISSION ANSWERS
INSERT INTO submission_answers (submission_id, question_id, answer_id)
VALUES
(1, 1, 1), (1, 2, 3), (2, 1, 1), (3, 3, 5);

-- 2.11 USER PROGRESS
INSERT INTO user_progress (user_id, lesson_id, is_completed)
VALUES
(4, 1, TRUE), (4, 2, TRUE), (4, 3, FALSE), (5, 1, TRUE), (5, 2, FALSE);

-- 2.12 CERTIFICATES
INSERT INTO certificates (user_id, course_id, pdf_url)
VALUES
(4, 1, 'https://certificates/java_cert_001.pdf'),
(5, 1, 'https://certificates/java_cert_002.pdf');