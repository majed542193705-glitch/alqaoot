#!/bin/bash

echo "========================================"
echo "   نظام إدارة مؤسسة القعوط للخدمات اللوجستية"
echo "========================================"
echo

echo "[1/4] التحقق من Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js غير مثبت. يرجى تثبيت Node.js من https://nodejs.org"
    exit 1
fi
echo "✅ Node.js مثبت: $(node --version)"

echo
echo "[2/4] التحقق من npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm غير متاح"
    exit 1
fi
echo "✅ npm متاح: $(npm --version)"

echo
echo "[3/4] تثبيت التبعيات..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ فشل في تثبيت التبعيات"
    exit 1
fi
echo "✅ تم تثبيت التبعيات بنجاح"

echo
echo "[4/4] تشغيل الخادم المحلي..."
echo
echo "🚀 سيتم فتح النظام في المتصفح على العنوان:"
echo "   http://localhost:5173"
echo
echo "🔐 بيانات تسجيل الدخول:"
echo "   اسم المستخدم: admin"
echo "   كلمة المرور: 123456"
echo
echo "⏹️  لإيقاف الخادم اضغط Ctrl+C"
echo

# فتح المتصفح (يعمل على معظم أنظمة Linux و macOS)
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:5173 &
elif command -v open &> /dev/null; then
    open http://localhost:5173 &
fi

npm run dev
