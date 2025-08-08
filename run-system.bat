@echo off
echo ========================================
echo    نظام إدارة مؤسسة القعوط للخدمات اللوجستية
echo ========================================
echo.

echo [1/4] التحقق من Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js غير مثبت. يرجى تثبيت Node.js من https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js مثبت

echo.
echo [2/4] التحقق من npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm غير متاح
    pause
    exit /b 1
)
echo ✅ npm متاح

echo.
echo [3/4] تثبيت التبعيات...
npm install
if %errorlevel% neq 0 (
    echo ❌ فشل في تثبيت التبعيات
    pause
    exit /b 1
)
echo ✅ تم تثبيت التبعيات بنجاح

echo.
echo [4/4] تشغيل الخادم المحلي...
echo.
echo 🚀 سيتم فتح النظام في المتصفح على العنوان:
echo    http://localhost:5173
echo.
echo 🔐 بيانات تسجيل الدخول:
echo    اسم المستخدم: admin
echo    كلمة المرور: 123456
echo.
echo ⏹️  لإيقاف الخادم اضغط Ctrl+C
echo.

start http://localhost:5173
npm run dev

pause
