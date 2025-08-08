# دليل النشر 🚀

هذا الدليل يوضح كيفية نشر نظام إدارة المركبات والموظفين على منصات مختلفة.

## 📋 متطلبات النشر

- Node.js 18+
- npm أو yarn
- Git
- حساب GitHub (للنشر على GitHub Pages)

## 🌐 النشر على GitHub Pages

### 1. إعداد المستودع

```bash
# إنشاء مستودع جديد على GitHub
# ثم ربطه بالمشروع المحلي

git init
git add .
git commit -m "Initial commit: Vehicle Management System"
git branch -M main
git remote add origin https://github.com/your-username/vehicle-management-system.git
git push -u origin main
```

### 2. تفعيل GitHub Pages

1. اذهب إلى إعدادات المستودع على GitHub
2. انتقل إلى قسم "Pages"
3. اختر "GitHub Actions" كمصدر
4. سيتم النشر تلقائياً عند كل push إلى main branch

### 3. الوصول للموقع

بعد النشر، سيكون الموقع متاح على:
```
https://your-username.github.io/vehicle-management-system/
```

## 🔧 النشر المحلي

### بناء المشروع

```bash
# بناء المشروع للإنتاج
npm run build

# معاينة البناء محلياً
npm run preview
```

### ملفات البناء

ستجد ملفات البناء في مجلد `dist/` والتي يمكن رفعها لأي خادم ويب.

## ☁️ النشر على منصات أخرى

### Vercel

```bash
# تثبيت Vercel CLI
npm i -g vercel

# النشر
vercel

# النشر للإنتاج
vercel --prod
```

### Netlify

1. اربط المستودع بـ Netlify
2. اضبط إعدادات البناء:
   - Build command: `npm run build`
   - Publish directory: `dist`

### Firebase Hosting

```bash
# تثبيت Firebase CLI
npm install -g firebase-tools

# تسجيل الدخول
firebase login

# تهيئة المشروع
firebase init hosting

# النشر
firebase deploy
```

## 🔐 متغيرات البيئة

إذا كنت تستخدم متغيرات بيئة، تأكد من إضافتها في:

### GitHub Actions
أضف المتغيرات في إعدادات المستودع > Secrets and variables > Actions

### Vercel
أضف المتغيرات في لوحة تحكم Vercel > Project Settings > Environment Variables

### Netlify
أضف المتغيرات في Site settings > Environment variables

## 📊 مراقبة الأداء

بعد النشر، يمكنك مراقبة:

- **سرعة التحميل**: استخدم Google PageSpeed Insights
- **الأخطاء**: راقب console logs في المتصفح
- **الاستخدام**: استخدم Google Analytics أو أدوات مشابهة

## 🔄 التحديثات التلقائية

مع GitHub Actions المُعد، سيتم:

1. بناء المشروع تلقائياً عند كل push
2. تشغيل الاختبارات (إذا كانت موجودة)
3. نشر النسخة الجديدة تلقائياً

## 🐛 استكشاف الأخطاء

### مشاكل شائعة:

**خطأ في المسارات:**
- تأكد من ضبط `base` في `vite.config.ts`
- تحقق من أن جميع المسارات نسبية

**مشاكل الخطوط:**
- تأكد من تحميل الخطوط العربية بشكل صحيح
- استخدم web fonts أو ضع الخطوط في مجلد public

**مشاكل الأيقونات:**
- تأكد من أن جميع أيقونات Lucide محملة بشكل صحيح

## 📞 الدعم

إذا واجهت مشاكل في النشر:

1. تحقق من logs البناء
2. راجع الوثائق الخاصة بالمنصة
3. افتح issue في المستودع

---

نتمنى لك نشراً ناجحاً! 🎉
