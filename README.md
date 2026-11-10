ต้องมี: .NET 8 SDK, Node.js, SQL Server
## 1) รัน SQL Server (Docker)
```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrong@Passw0rd" \
  -p 1433:1433 --name sql1 -d mcr.microsoft.com/mssql/server:2022-latest
```
ถ้าใช้ SQL Server ตัวอื่น แก้ `ConnectionStrings:Default` ใน `backend\appsettings.json`

## 2) Backend
   cd backend
   dotnet run

## 3) Frontend
   cd frontend
   npm install
   npm start
   เปิด http://localhost:4200


- สร้างงาน: ปุ่ม "+ สร้างงาน" หรือปุ่ม + บนหัวคอลัมน์
- เปลี่ยนสถานะ: ลากการ์ดไปวางคอลัมน์อื่น
- แก้ไข/ลบ: เอาเมาส์ชี้การ์ดแล้วกดไอคอน
- ใช้ SQL Server ตัวเต็ม: แก้ Connection String ใน backend/appsettings.json
