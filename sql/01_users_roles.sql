USE Northwind;
GO

-- 1. Tao bang Roles va chen du lieu mac dinh
CREATE TABLE Roles (
    RoleId INT PRIMARY KEY,
    RoleName NVARCHAR(50) NOT NULL UNIQUE
);
GO

INSERT INTO Roles (RoleId, RoleName) VALUES
    (1, N'Admin'),
    (2, N'NhanVien'),
    (3, N'KhachHang');
GO

-- 2. Tao bang Users
CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(200) NOT NULL,
    FullName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NULL,
    RoleId INT NOT NULL DEFAULT 3,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Users_Roles FOREIGN KEY (RoleId) REFERENCES Roles (RoleId)
);
GO

-- 3. Tao san mot tai khoan Admin mac dinh (Mat khau: Admin@123)
INSERT INTO Users (Username, PasswordHash, FullName, Email, RoleId)
VALUES (
    N'admin',
    N'$2b$10$CwTycUXWue0Thq9StjUM0uJ8vAHq02NbAwvyw3M.8IYVgJ3tq3/oi',
    N'Quan tri vien he thong',
    N'admin@shopapp.local',
    1
);
GO
