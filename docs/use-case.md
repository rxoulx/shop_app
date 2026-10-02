# PHÂN TÍCH YÊU CẦU & USE CASE - HỆ THỐNG QUẢN LÝ CỬA HÀNG

## 1. Danh sách Actor (Tác nhân)
- **Khách (chưa đăng nhập):** Chỉ xem được danh sách sản phẩm công khai, có thể đăng ký tài khoản mới.
- **Khách hàng (KhachHang):** Đã đăng nhập; xem sản phẩm, xem chi tiết - chưa có quyền chỉnh sửa dữ liệu.
- **Nhân viên (NhanVien):** Đã đăng nhập; thêm/sửa sản phẩm, KHÔNG được xoá sản phẩm.
- **Quản trị viên (Admin):** Toàn quyền: thêm/sửa/xoá sản phẩm, quản lý tài khoản người dùng.

## 2. Sơ đồ Use Case (Mermaid)

```mermaid
graph LR
    Khach((Khach))
    KhachHang((Khach hang))
    NhanVien((Nhan vien))
    Admin((Admin))

    Khach --> UC1[Xem danh sach san pham]
    Khach --> UC2[Dang ky tai khoan]

    KhachHang --> UC1
    KhachHang --> UC3[Dang nhap]

    NhanVien --> UC3
    NhanVien --> UC4[Them san pham]
    NhanVien --> UC5[Sua san pham]

    Admin --> UC3
    Admin --> UC4
    Admin --> UC5
    Admin --> UC6[Xoa san pham]
    Admin --> UC7[Phan quyen nguoi dung]