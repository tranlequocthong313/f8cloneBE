# F8 Clone BE - Backend (Express.js)

**F8 Clone BE** là phần backend của nền tảng E-learning, được phát triển bằng Express.js, hỗ trợ các tính năng quản lý khóa học, bài học, người dùng, và xác thực. Phần backend này cung cấp các API cần thiết để kết nối với frontend ReactJS và mô phỏng lại các tính năng của [Fullstack.edu.vn](https://fullstack.edu.vn/).

## Tính năng chính

- **Quản lý khóa học**: Thêm, sửa, xóa, và lấy thông tin khóa học.
- **Quản lý bài học**: Thêm, sửa, xóa, và lấy thông tin bài học trong khóa học.
- **Quản lý người dùng**: Đăng ký, đăng nhập, và quản lý thông tin người dùng.
- **Xác thực và phân quyền**: Xác thực người dùng bằng JWT và phân quyền (học viên, giảng viên, admin).
- **Tìm kiếm**: Hỗ trợ tìm kiếm khóa học và bài học.
- **API RESTful**: Cung cấp các API để tích hợp với frontend.

## Công nghệ sử dụng

- **Backend**: Express.js, Node.js
- **Database**: MongoDB (hoặc MySQL/PostgreSQL tùy cấu hình)
- **Authentication**: JWT (JSON Web Token)
- **API Documentation**: Swagger/OpenAPI (sử dụng `swagger-jsdoc` hoặc `swagger-ui-express`)
- **Deployment**: Docker, Nginx, PM2 (tùy chọn)

## Cài đặt và chạy dự án

### Yêu cầu hệ thống

- Node.js (phiên bản 14.x trở lên)
- npm hoặc yarn
- MongoDB (hoặc cơ sở dữ liệu khác tùy cấu hình)

### Các bước cài đặt

1. **Clone dự án**:
   ```bash
   git clone https://github.com/tranlequocthong313/f8cloneBE.git
   cd f8cloneBE
   ```

2. **Cài đặt các dependencies**:
   ```bash
   npm install
   # hoặc
   yarn install
   ```

3. **Cấu hình cơ sở dữ liệu**:
   - Cấu hình kết nối MongoDB trong file `.env`:
     ```env
     MONGO_URI=mongodb://localhost:27017/f8clone
     JWT_SECRET=your-secret-key
     PORT=5000
     ```

4. **Chạy dự án**:
   ```bash
   npm start
   # hoặc
   yarn start
   ```

5. **Truy cập API**:
   - Mở trình duyệt hoặc sử dụng công cụ như Postman để truy cập các API tại: `http://localhost:5000/api`
   - Để xem tài liệu API (nếu có), truy cập: `http://localhost:5000/api-docs`

### Cấu hình môi trường

Tạo file `.env` trong thư mục gốc của dự án và thêm các biến môi trường cần thiết:

```env
MONGO_URI=mongodb://localhost:27017/f8clone
JWT_SECRET=your-secret-key
PORT=5000
```

## Cấu trúc thư mục

```
f8cloneBE/
├── src/
│   ├── config/              # Cấu hình kết nối database, middleware, v.v.
│   ├── controllers/         # Các controller xử lý logic nghiệp vụ
│   ├── models/              # Các model (MongoDB Schema hoặc Sequelize Model)
│   ├── routes/              # Các route (API endpoints)
│   ├── services/            # Các service xử lý logic nghiệp vụ
│   ├── utils/               # Các tiện ích (helper functions, JWT, v.v.)
│   ├── app.js               # File khởi tạo ứng dụng Express
│   └── server.js            # File khởi chạy server
├── .env                     # File cấu hình môi trường
├── package.json             # Danh sách dependencies và scripts
└── README.md                # Tài liệu hướng dẫn
```

## API Endpoints

Dưới đây là một số API endpoints chính:

### Người dùng (Users)
- **Đăng ký**: `POST /api/auth/register`
- **Đăng nhập**: `POST /api/auth/login`
- **Lấy thông tin người dùng**: `GET /api/users/{id}`

### Khóa học (Courses)
- **Lấy danh sách khóa học**: `GET /api/courses`
- **Tạo khóa học mới**: `POST /api/courses`
- **Lấy thông tin chi tiết khóa học**: `GET /api/courses/{id}`
- **Cập nhật khóa học**: `PUT /api/courses/{id}`
- **Xóa khóa học**: `DELETE /api/courses/{id}`

### Bài học (Lessons)
- **Lấy danh sách bài học**: `GET /api/lessons`
- **Tạo bài học mới**: `POST /api/lessons`
- **Lấy thông tin chi tiết bài học**: `GET /api/lessons/{id}`
- **Cập nhật bài học**: `PUT /api/lessons/{id}`
- **Xóa bài học**: `DELETE /api/lessons/{id}`

### Tìm kiếm (Search)
- **Tìm kiếm khóa học**: `GET /api/search/courses?q={keyword}`
- **Tìm kiếm bài học**: `GET /api/search/lessons?q={keyword}`

## Đóng góp

Nếu bạn muốn đóng góp vào dự án, vui lòng làm theo các bước sau:

1. Fork dự án
2. Tạo branch mới (`git checkout -b feature/YourFeatureName`)
3. Commit các thay đổi (`git commit -m 'Add some feature'`)
4. Push lên branch (`git push origin feature/YourFeatureName`)
5. Mở một Pull Request

## Liên hệ

Nếu bạn có bất kỳ câu hỏi hoặc góp ý nào, vui lòng liên hệ:

- **Tên**: Trần Lê Quốc Thông
- **Email**: tranlequocthong313@gmail.com
- **GitHub**: [tranlequocthong313](https://github.com/tranlequocthong313)
