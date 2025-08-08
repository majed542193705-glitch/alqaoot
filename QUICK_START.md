# دليل البدء السريع ⚡

## 🚀 **تشغيل المشروع محلياً**

### المتطلبات
- Node.js 18+ 
- npm أو yarn

### خطوات التشغيل
```bash
# 1. استنساخ المشروع
git clone https://github.com/majed542193705-glitch/alqaoot.git
cd alqaoot

# 2. تثبيت التبعيات
npm install

# 3. تشغيل الخادم المحلي
npm run dev

# 4. فتح المتصفح
# الموقع سيعمل على: http://localhost:5173
```

## 🌐 **النشر على Netlify**

### الطريقة الأولى: ربط GitHub
1. اذهب إلى [netlify.com](https://netlify.com)
2. سجل دخول بحساب GitHub
3. اضغط "New site from Git"
4. اختر مستودع `alqaoot`
5. الإعدادات ستكون تلقائية من ملف `netlify.toml`

### الطريقة الثانية: رفع مباشر
```bash
# بناء المشروع
npm run build

# رفع مجلد dist إلى Netlify
```

## 📁 **هيكل المشروع**

```
alqaoot/
├── public/              # ملفات عامة
├── src/                 # كود المصدر
│   ├── components/      # مكونات React
│   ├── contexts/        # React Contexts
│   ├── hooks/          # Custom Hooks
│   ├── types/          # تعريفات TypeScript
│   └── utils/          # دوال مساعدة
├── index.html          # صفحة HTML الرئيسية
├── package.json        # تبعيات المشروع
├── vite.config.ts      # إعدادات Vite
├── netlify.toml        # إعدادات Netlify
└── README.md           # وثائق المشروع
```

## 🔧 **الأوامر المتاحة**

```bash
npm run dev          # تشغيل خادم التطوير
npm run build        # بناء للإنتاج
npm run preview      # معاينة البناء
npm run lint         # فحص الكود
```

## 🎯 **الميزات الرئيسية**

- ✅ **إدارة المركبات**: تفاويض، تأمين، كروت تشغيل
- ✅ **إدارة الموظفين**: بيانات، سلف، بطاقات سائقين
- ✅ **نظام التنبيهات**: إشعارات ذكية للوثائق
- ✅ **واجهة ثنائية اللغة**: عربي/إنجليزي
- ✅ **الوضع المظلم**: تبديل تلقائي
- ✅ **تصميم متجاوب**: يعمل على جميع الأجهزة

## 🆘 **حل المشاكل الشائعة**

### مشكلة في تثبيت التبعيات:
```bash
# حذف node_modules وإعادة التثبيت
rm -rf node_modules package-lock.json
npm install
```

### مشكلة في البناء:
```bash
# تنظيف الكاش
npm run build -- --force
```

### مشكلة في Netlify:
- تأكد من وجود ملف `netlify.toml`
- تحقق من إعدادات البناء في لوحة Netlify
- راجع logs البناء للأخطاء

## 📞 **الدعم**

- **GitHub Issues**: [رابط المستودع](https://github.com/majed542193705-glitch/alqaoot/issues)
- **الوثائق**: راجع `README.md` للتفاصيل الكاملة
- **المساهمة**: راجع `CONTRIBUTING.md`

---

**نصيحة**: احفظ هذا الملف كمرجع سريع! 📌
