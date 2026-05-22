NestLMS - Smart Learning Management System (Backend)

📝 Giới thiệu chung
Dự án được xây dựng phục vụ môn học Các công nghệ lập trình hiện đại. Hệ thống tập trung vào việc cung cấp giải pháp Backend cho quản lý khóa học, bài thi trắc nghiệm và theo dõi tiến độ học tập dựa trên kiến trúc Modular Monolith.

🚀 Hướng dẫn cài đặt nhanh cho nhóm
1. Yêu cầu môi trường
Node.js: v18+

PostgreSQL: v16+ (Database chính)

Package Manager: pnpm (Bắt buộc dùng pnpm để đồng bộ hệ thống)

2. Thiết lập cơ sở dữ liệu
Tạo Database nest_lms_db trong pgAdmin.

Chuột phải vào database chọn Query Tool, mở file SQL của nhóm và nhấn F5 để khởi tạo bảng.

3. Cài đặt Project
Bash
# 1. Clone dự án từ GitHub
$ git clone https://github.com/Melanie-Elain/nest-lms-backend.git

# 2. Cài đặt thư viện (Dùng pnpm để tránh lỗi npm matches)
$ pnpm install

3. Chạy dự án
Bash
# Chế độ lập trình (Auto-reload khi sửa code)
$ pnpm run start:dev


📂 Phân công nhiệm vụ (Architecture)
Hệ thống được chia thành 4 vùng chính tương ứng với 3 thành viên:

src/iam (SV1 - Trưởng nhóm): Identity & Access Management (Auth, Users, Roles).

src/learning (SV2): Quản lý nội dung học thuật (Courses, Lessons, Sections).

src/examination (SV3): Hệ thống thi cử (Quizzes, Questions, Submissions).

src/tracking: Theo dõi tiến độ & Chứng chỉ (Sử dụng chung).

📖 Tài liệu API (Swagger)
Sau khi chạy server, nhóm không cần dùng giao diện Frontend mà có thể test trực tiếp tại: 👉 http://localhost:3000/api

🛠 Lệnh kiểm thử (Testing)
Bash
# Unit tests (Kiểm tra logic chấm điểm)
$ pnpm run test
⚠️ Quy tắc làm việc nhóm
Tuyệt đối dùng pnpm: Không dùng npm để tránh tạo file lock thừa.

Git Flow: Luôn git pull trước khi bắt đầu code.

Common: Các guards, interceptors nằm trong src/common, hãy tận dụng thay vì viết lại.
