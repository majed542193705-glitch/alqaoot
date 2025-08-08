import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, DollarSign, Calendar, Filter, TrendingUp, AlertCircle, CheckCircle, FileText } from 'lucide-react';
import { Advance, Payment } from '../../types';
import AdvanceForm from './AdvanceForm';
import PaymentForm from './PaymentForm';
import { useTheme } from '../../contexts/ThemeContext';
import { t } from '../../utils/translations';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AdvancesList: React.FC = () => {
  const { language } = useTheme();
  const [advances, setAdvances] = useState<Advance[]>([
    {
      id: '1',
      employeeId: '1',
      type: 'personal_advance',
      amount: 5000,
      date: '2024-01-15',
      payments: [
        {
          id: '1',
          advanceId: '1',
          amount: 2000,
          date: '2024-02-01',
          type: 'bank_transfer',
          operationNumber: 'TXN123456',
          attachment: ''
        }
      ],
      remainingAmount: 3000
    },
    {
      id: '2',
      employeeId: '1',
      type: 'medical_insurance_fees',
      amount: 3000,
      date: '2024-02-01',
      payments: [],
      remainingAmount: 3000
    },
    {
      id: '3',
      employeeId: '2',
      type: 'residence_renewal_fees',
      amount: 2500,
      date: '2024-02-10',
      payments: [
        {
          id: '2',
          advanceId: '3',
          amount: 1000,
          date: '2024-02-15',
          type: 'cash',
          operationNumber: 'CASH001',
          attachment: ''
        }
      ],
      remainingAmount: 1500
    },
    {
      id: '4',
      employeeId: '3',
      type: 'traffic_violation_fees',
      amount: 800,
      date: '2024-02-20',
      payments: [],
      remainingAmount: 800
    }
  ]);

  const [showAdvanceForm, setShowAdvanceForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingAdvance, setEditingAdvance] = useState<Advance | null>(null);
  const [selectedAdvanceForPayment, setSelectedAdvanceForPayment] = useState<Advance | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const handleAddAdvance = () => {
    setEditingAdvance(null);
    setShowAdvanceForm(true);
  };

  const handleEditAdvance = (advance: Advance) => {
    setEditingAdvance(advance);
    setShowAdvanceForm(true);
  };

  const handleDeleteAdvance = (id: string) => {
    const confirmMessage = language === 'ar'
      ? 'هل أنت متأكد من حذف هذه السلفة؟'
      : 'Are you sure you want to delete this advance?';
    if (confirm(confirmMessage)) {
      setAdvances(advances.filter(advance => advance.id !== id));
    }
  };

  const handleSaveAdvance = (advanceData: Omit<Advance, 'id' | 'payments' | 'remainingAmount'>) => {
    if (editingAdvance) {
      setAdvances(advances.map(advance =>
        advance.id === editingAdvance.id
          ? { ...advance, ...advanceData }
          : advance
      ));
    } else {
      const newAdvance: Advance = {
        ...advanceData,
        id: Date.now().toString(),
        payments: [],
        remainingAmount: advanceData.amount
      };
      setAdvances([...advances, newAdvance]);
    }
    setShowAdvanceForm(false);
    setEditingAdvance(null);
  };

  const handleAddPayment = (advance: Advance) => {
    setSelectedAdvanceForPayment(advance);
    setShowPaymentForm(true);
  };

  const handleFullPayment = (advance: Advance) => {
    const confirmMessage = `هل أنت متأكد من سداد المبلغ المتبقي بالكامل؟\n\nتفاصيل السلفة:\n- الموظف: ${getEmployeeName(advance.employeeId)}\n- نوع السلفة: ${getAdvanceTypeText(advance.type)}\n- المبلغ المتبقي: ${advance.remainingAmount.toLocaleString()} ريال\n\nسيتم إغلاق هذه السلفة نهائياً بعد السداد.`;

    if (confirm(confirmMessage)) {
      const fullPayment: Payment = {
        id: Date.now().toString(),
        advanceId: advance.id,
        amount: advance.remainingAmount,
        date: new Date().toISOString().split('T')[0],
        type: 'cash', // يمكن تغييرها حسب الحاجة
        operationNumber: `FULL-${Date.now()}`,
        attachment: ''
      };

      // إضافة الدفعة وتحديث المبلغ المتبقي
      setAdvances(advances.map(adv =>
        adv.id === advance.id
          ? {
            ...adv,
            payments: [...adv.payments, fullPayment],
            remainingAmount: 0
          }
          : adv
      ));

      alert('تم سداد السلفة بالكامل بنجاح!');
    }
  };

  const handleSavePayment = (paymentData: Omit<Payment, 'id' | 'advanceId'>) => {
    if (selectedAdvanceForPayment) {
      const newPayment: Payment = {
        ...paymentData,
        id: Date.now().toString(),
        advanceId: selectedAdvanceForPayment.id
      };

      setAdvances(advances.map(advance => {
        if (advance.id === selectedAdvanceForPayment.id) {
          const updatedPayments = [...advance.payments, newPayment];
          const totalPaid = updatedPayments.reduce((sum, payment) => sum + payment.amount, 0);
          return {
            ...advance,
            payments: updatedPayments,
            remainingAmount: advance.amount - totalPaid
          };
        }
        return advance;
      }));
    }
    setShowPaymentForm(false);
    setSelectedAdvanceForPayment(null);
  };

  const filteredAdvances = advances.filter(advance => {
    const matchesSearch = advance.employeeId.includes(searchTerm);
    const matchesFilter = filterType === 'all' || advance.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getAdvanceTypeText = (advance: Advance) => {
    const { type, customDescription } = advance;

    // إذا كان النوع "أخرى" وهناك وصف مخصص، اعرض الوصف المخصص
    if (type === 'other_fees' && customDescription) {
      return customDescription;
    }

    switch (type) {
      case 'work_permit_fees': return t('workPermitFees', language);
      case 'residence_renewal_fees': return t('residenceRenewalFees', language);
      case 'medical_insurance_fees': return t('medicalInsuranceFees', language);
      case 'personal_advance': return t('personalAdvance', language);
      // للتوافق مع البيانات القديمة
      case 'personal': return t('personalAdvance', language);
      case 'dues': return language === 'ar' ? 'مستحقات' : 'Dues';
      case 'transfer_documents': return language === 'ar' ? 'وثائق نقل' : 'Transfer Documents';
      case 'medical_insurance': return t('medicalInsuranceFees', language);
      case 'other': return language === 'ar' ? 'أخرى' : 'Other';
      case 'traffic_violation_fees': return language === 'ar' ? 'رسوم مخالفة مرورية' : 'Traffic Violation Fees';
      case 'transport_authority_violation_fees': return language === 'ar' ? 'رسوم مخالفة هيئة النقل' : 'Transport Authority Violation Fees';
      case 'car_insurance_fees': return language === 'ar' ? 'رسوم تأمين سيارة' : 'Car Insurance Fees';
      case 'exit_reentry_visa_fees': return language === 'ar' ? 'رسوم تأشيرة خروج وعودة' : 'Exit Re-entry Visa Fees';
      case 'other_fees': return language === 'ar' ? 'أخرى' : 'Other';
      default: return type;
    }
  };

  const getPaymentTypeText = (type: string) => {
    switch (type) {
      case 'bank_transfer': return t('bankTransfer', language);
      case 'cash': return t('cash', language);
      case 'check': return t('check', language);
      case 'credit_card': return t('creditCard', language);
      case 'receipt': return language === 'ar' ? 'سند قبض' : 'Receipt';
      default: return type;
    }
  };

  // بيانات تجريبية للموظفين
  const employees = [
    { id: '1', name: 'أحمد محمد علي السعيد' },
    { id: '2', name: 'محمد أحمد علي' }
  ];

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : 'غير محدد';
  };

  // دالة إنشاء تقرير PDF للسلفة
  const generateAdvancePDF = (advance: Advance) => {
    const doc = new jsPDF();

    // إعداد الخط
    doc.setFont('helvetica');

    // رسم الشعار (دائرة بسيطة مع نص)
    doc.setFillColor(44, 82, 130);
    doc.circle(30, 25, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('TMS', 30, 28, { align: 'center' });

    // معلومات الشركة
    doc.setTextColor(44, 82, 130);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('TRANSPORT MANAGEMENT SYSTEM', 50, 20);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Nezam Edarat Alnaql', 50, 28);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Kingdom of Saudi Arabia', 50, 35);

    // العنوان الرئيسي
    doc.setFontSize(20);
    doc.setTextColor(44, 82, 130);
    doc.setFont('helvetica', 'bold');
    doc.text('ADVANCE REPORT', 105, 55, { align: 'center' });
    doc.setFontSize(16);
    doc.text('Taqreer Alsulfa', 105, 65, { align: 'center' });

    // خط فاصل مزدوج
    doc.setLineWidth(1);
    doc.setDrawColor(44, 82, 130);
    doc.line(20, 75, 190, 75);
    doc.setLineWidth(0.3);
    doc.line(20, 78, 190, 78);

    // معلومات السلفة
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    let yPosition = 95;

    // إضافة رقم مرجعي للتقرير
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const reportId = `ADV-${advance.id}-${new Date().getFullYear()}`;
    doc.text(`Report ID: ${reportId}`, 190, 50, { align: 'right' });

    const employeeName = getEmployeeName(advance.employeeId);
    const advanceType = getAdvanceTypeText(advance.type);
    const totalPaid = advance.amount - advance.remainingAmount;

    // دالة لتنظيف النص من الأحرف الخاصة
    const cleanText = (text: string) => {
      return text.replace(/[^\w\s.-]/g, '').trim();
    };

    // دالة لتنسيق الأرقام
    const formatNumber = (num: number) => {
      return new Intl.NumberFormat('en-US').format(Math.round(num));
    };

    // إطار للمعلومات الأساسية مع خلفية
    doc.setFillColor(248, 249, 250);
    doc.setDrawColor(44, 82, 130);
    doc.setLineWidth(1);
    doc.roundedRect(15, 85, 180, 85, 3, 3, 'FD');

    // عنوان القسم
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(44, 82, 130);
    doc.text('ADVANCE DETAILS', 105, yPosition, { align: 'center' });
    yPosition += 15;

    // بيانات السلفة بتصميم محسن
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);

    // الصف الأول: اسم الموظف ونوع السلفة
    doc.setFont('helvetica', 'bold');
    doc.text('Employee Name:', 20, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(cleanText(employeeName), 75, yPosition);

    doc.setFont('helvetica', 'bold');
    doc.text('Advance Type:', 120, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(cleanText(advanceType), 165, yPosition);
    yPosition += 15;

    // الصف الثاني: المبلغ الإجمالي والتاريخ
    doc.setFont('helvetica', 'bold');
    doc.text('Total Amount:', 20, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(44, 82, 130);
    doc.text(`${formatNumber(advance.amount)} SAR`, 75, yPosition);
    doc.setTextColor(0, 0, 0);

    doc.setFont('helvetica', 'bold');
    doc.text('Date:', 120, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date(advance.date).toLocaleDateString('en-US'), 165, yPosition);
    yPosition += 15;

    // الصف الثالث: المبلغ المسدد والمتبقي
    doc.setFont('helvetica', 'bold');
    doc.text('Paid Amount:', 20, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 150, 0);
    doc.text(`${formatNumber(totalPaid)} SAR`, 75, yPosition);
    doc.setTextColor(0, 0, 0);

    doc.setFont('helvetica', 'bold');
    doc.text('Remaining Amount:', 120, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(advance.remainingAmount > 0 ? 220 : 0, advance.remainingAmount > 0 ? 53 : 150, advance.remainingAmount > 0 ? 69 : 0);
    doc.text(`${formatNumber(advance.remainingAmount)} SAR`, 165, yPosition);
    doc.setTextColor(0, 0, 0);
    yPosition += 15;

    // الصف الرابع: الحالة
    doc.setFont('helvetica', 'bold');
    doc.text('Status:', 20, yPosition);
    doc.setFont('helvetica', 'normal');
    const status = advance.remainingAmount === 0 ? 'Fully Paid' : 'Partially Paid';
    doc.setTextColor(advance.remainingAmount === 0 ? 0 : 255, advance.remainingAmount === 0 ? 150 : 140, advance.remainingAmount === 0 ? 0 : 0);
    doc.text(status, 75, yPosition);
    doc.setTextColor(0, 0, 0);

    // إذا كان هناك مدفوعات، أضف جدول المدفوعات
    if (advance.payments.length > 0) {
      yPosition += 25;

      // عنوان قسم المدفوعات
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(44, 82, 130);
      doc.text('PAYMENT DETAILS', 105, yPosition, { align: 'center' });
      doc.setTextColor(0, 0, 0);
      yPosition += 10;

      // إعداد جدول المدفوعات
      const tableData = advance.payments.map((payment, index) => [
        (index + 1).toString(),
        `${formatNumber(payment.amount)} SAR`,
        new Date(payment.date).toLocaleDateString('en-US'),
        cleanText(getPaymentTypeText(payment.type)),
        payment.operationNumber || '-'
      ]);

      (doc as any).autoTable({
        startY: yPosition,
        head: [['#', 'Amount', 'Date', 'Payment Type', 'Operation Number']],
        body: tableData,
        theme: 'striped',
        styles: {
          fontSize: 10,
          cellPadding: 6,
          textColor: [0, 0, 0],
          lineColor: [200, 200, 200],
          lineWidth: 0.2,
          halign: 'center',
          valign: 'middle'
        },
        headStyles: {
          fillColor: [44, 82, 130],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 11,
          halign: 'center',
          valign: 'middle'
        },
        alternateRowStyles: {
          fillColor: [248, 249, 250]
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 20 },
          1: { halign: 'center', cellWidth: 35 },
          2: { halign: 'center', cellWidth: 35 },
          3: { halign: 'center', cellWidth: 50 },
          4: { halign: 'center', cellWidth: 40 }
        },
        margin: { left: 15, right: 15 }
      });

      // إضافة ملخص المدفوعات في إطار
      const finalY = (doc as any).lastAutoTable.finalY + 15;
      doc.setFillColor(44, 82, 130);
      doc.setDrawColor(44, 82, 130);
      doc.roundedRect(15, finalY - 5, 180, 20, 3, 3, 'FD');

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(`Total Payments: ${advance.payments.length}`, 20, finalY + 5);
      doc.text(`Total Paid Amount: ${formatNumber(totalPaid)} SAR`, 20, finalY + 12);
      doc.setTextColor(0, 0, 0);
    }

    // تذييل التقرير
    const pageHeight = doc.internal.pageSize.height;

    // خط فاصل في التذييل
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(20, pageHeight - 35, 190, pageHeight - 35);

    // معلومات الإنشاء
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    const currentDate = new Date();
    const dateStr = currentDate.toLocaleDateString('en-US');
    const timeStr = currentDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    doc.text(`Generated on: ${dateStr} at ${timeStr}`, 20, pageHeight - 25);

    // معلومات النظام
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(44, 82, 130);
    doc.text('TRANSPORT MANAGEMENT SYSTEM', 105, pageHeight - 15, { align: 'center' });
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Kingdom of Saudi Arabia', 105, pageHeight - 8, { align: 'center' });

    // رقم الصفحة
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Page 1 of 1', 190, pageHeight - 25, { align: 'right' });

    // حفظ الملف
    const cleanEmployeeName = cleanText(employeeName).replace(/\s+/g, '_');
    const fileName = `advance_report_${cleanEmployeeName}_${currentDate.toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  // حساب الإحصائيات
  const totalAdvances = advances.length;
  const totalAmount = advances.reduce((sum, advance) => sum + advance.amount, 0);
  const totalPaid = advances.reduce((sum, advance) => sum + (advance.amount - advance.remainingAmount), 0);
  const totalRemaining = advances.reduce((sum, advance) => sum + advance.remainingAmount, 0);

  if (showAdvanceForm) {
    return (
      <AdvanceForm
        advance={editingAdvance}
        onSave={handleSaveAdvance}
        onCancel={() => {
          setShowAdvanceForm(false);
          setEditingAdvance(null);
        }}
      />
    );
  }

  if (showPaymentForm && selectedAdvanceForPayment) {
    return (
      <PaymentForm
        advance={selectedAdvanceForPayment}
        onSave={handleSavePayment}
        onCancel={() => {
          setShowPaymentForm(false);
          setSelectedAdvanceForPayment(null);
        }}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('advances', language)}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {language === 'ar' ? 'إدارة ومتابعة السلف مع خيارات السداد المتنوعة' : 'Manage and track advances with various payment options'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* عدد السلف غير المسددة */}
            {filteredAdvances.filter(advance => advance.remainingAmount > 0).length > 0 && (
              <div className="text-center">
                <div className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 px-3 py-1 rounded-full text-sm font-medium">
                  {filteredAdvances.filter(advance => advance.remainingAmount > 0).length} سلفة غير مسددة
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  إجمالي: {filteredAdvances.filter(advance => advance.remainingAmount > 0).reduce((sum, advance) => sum + advance.remainingAmount, 0).toLocaleString()} ريال
                </div>
              </div>
            )}

            <button
              onClick={handleAddAdvance}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 rtl:space-x-reverse transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>{t('addAdvance', language)}</span>
            </button>
          </div>
        </div>

        {/* شريط البحث والفلترة */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={language === 'ar' ? 'البحث في السلف...' : 'Search advances...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 rtl:pr-10 rtl:pl-4 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 rtl:pr-10 rtl:pl-4 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">جميع الأنواع</option>
              <option value="work_permit_fees">رسوم رخصة عمل</option>
              <option value="residence_renewal_fees">رسوم تجديد اقامة</option>
              <option value="traffic_violation_fees">رسوم مخالفة مرورية</option>
              <option value="transport_authority_violation_fees">رسوم مخالفة هيئة النقل</option>
              <option value="medical_insurance_fees">رسوم تأمين طبي</option>
              <option value="car_insurance_fees">رسوم تامين سيارة</option>
              <option value="exit_reentry_visa_fees">رسوم تأشيرة خروج وعودة</option>
              <option value="personal_advance">سلفة شخصية</option>
              <option value="other_fees">رسوم أخرى</option>
            </select>
          </div>
        </div>

        {/* إرشادات السداد */}
        {filteredAdvances.some(advance => advance.remainingAmount > 0) && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                  خيارات سداد السلف
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  يمكنك سداد السلف من خلال عمود "الإجراءات" في الجدول أدناه:
                </p>
                <ul className="text-sm text-blue-700 dark:text-blue-400 mt-2 space-y-1">
                  <li className="flex items-center gap-2">
                    <span className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      دفعة
                    </span>
                    - لإضافة دفعة جزئية مع تحديد المبلغ وطريقة السداد
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      سداد كامل
                    </span>
                    - لسداد المبلغ المتبقي بالكامل وإغلاق السلفة
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400">إجمالي السلف</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{totalAdvances}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400">
                  {language === 'ar' ? 'إجمالي المبلغ' : 'Total Amount'}
                </p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {totalAmount.toLocaleString()} {language === 'ar' ? 'ريال' : 'SAR'}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  {t('paidAmount', language)}
                </p>
                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                  {totalPaid.toLocaleString()} {language === 'ar' ? 'ريال' : 'SAR'}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 dark:text-red-400">
                  {t('remainingAmount', language)}
                </p>
                <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                  {totalRemaining.toLocaleString()} {language === 'ar' ? 'ريال' : 'SAR'}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* جدول السلف - عرض سطح المكتب */}
        <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {language === 'ar' ? 'اسم الموظف' : 'Employee Name'}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('advanceType', language)}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('amount', language)}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('paidAmount', language)}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('remainingAmount', language)}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t('date', language)}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {language === 'ar' ? 'الإجراءات' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAdvances.map((advance) => (
                  <tr key={advance.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {getEmployeeName(advance.employeeId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {getAdvanceTypeText(advance.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {advance.amount.toLocaleString()} {language === 'ar' ? 'ريال' : 'SAR'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {(advance.amount - advance.remainingAmount).toLocaleString()} {language === 'ar' ? 'ريال' : 'SAR'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${advance.remainingAmount === 0
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                        {advance.remainingAmount.toLocaleString()} {language === 'ar' ? 'ريال' : 'SAR'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(advance.date).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {advance.remainingAmount > 0 ? (
                          <div className="flex items-center gap-1">
                            {/* زر السداد الجزئي */}
                            <button
                              onClick={() => handleAddPayment(advance)}
                              className="bg-green-100 hover:bg-green-200 dark:bg-green-900/20 dark:hover:bg-green-800/30 text-green-700 dark:text-green-400 px-2 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors"
                              title={language === 'ar' ? 'إضافة دفعة جزئية' : 'Add partial payment'}
                            >
                              <DollarSign className="w-3 h-3" />
                              {language === 'ar' ? 'دفعة' : 'Payment'}
                            </button>

                            {/* زر السداد الكامل */}
                            <button
                              onClick={() => handleFullPayment(advance)}
                              className="bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-800/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors"
                              title={language === 'ar' ? 'سداد المبلغ المتبقي بالكامل' : 'Pay remaining amount in full'}
                            >
                              <CheckCircle className="w-3 h-3" />
                              {language === 'ar' ? 'سداد كامل' : 'Full Payment'}
                            </button>
                          </div>
                        ) : (
                          <span className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            مسددة
                          </span>
                        )}

                        {/* زر PDF */}
                        <button
                          onClick={() => generateAdvancePDF(advance)}
                          className="bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-800/30 text-red-700 dark:text-red-400 px-2 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors mr-1"
                          title="طباعة تقرير PDF"
                        >
                          <FileText className="w-3 h-3" />
                          PDF
                        </button>

                        {/* أزرار التحكم */}
                        <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-600 pr-2 mr-1">
                          <button
                            onClick={() => handleEditAdvance(advance)}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                            title={language === 'ar' ? 'تعديل السلفة' : 'Edit advance'}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAdvance(advance.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                            title={language === 'ar' ? 'حذف السلفة' : 'Delete advance'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAdvances.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                {language === 'ar' ? 'لا توجد سلف مطابقة لمعايير البحث' : 'No advances match the search criteria'}
              </p>
            </div>
          )}
        </div>

        {/* عرض الكارد للأجهزة المحمولة */}
        <div className="lg:hidden space-y-4">
          {filteredAdvances.map((advance) => {
            const employee = employees.find(emp => emp.id === advance.employeeId);
            const employeeName = employee ? employee.name : 'موظف غير معروف';
            const totalPaid = advance.payments.reduce((sum, payment) => sum + payment.amount, 0);
            const advanceType = getAdvanceTypeLabel(advance.type, advance.customDescription);

            return (
              <div key={advance.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
                {/* رأس الكارد */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{employeeName}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{advanceType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditAdvance(advance)}
                      className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => generateAdvancePDF(advance)}
                      className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAdvance(advance.id)}
                      className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* معلومات المبالغ */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">المبلغ الإجمالي</p>
                    <p className="font-bold text-blue-700 dark:text-blue-300">{advance.amount.toLocaleString()} ريال</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <p className="text-xs text-green-600 dark:text-green-400 mb-1">المبلغ المسدد</p>
                    <p className="font-bold text-green-700 dark:text-green-300">{totalPaid.toLocaleString()} ريال</p>
                  </div>
                </div>

                {/* المبلغ المتبقي والتاريخ */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(advance.date).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-red-600 dark:text-red-400">المتبقي</p>
                    <p className="font-bold text-red-700 dark:text-red-300">{advance.remainingAmount.toLocaleString()} ريال</p>
                  </div>
                </div>

                {/* شريط التقدم */}
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">نسبة السداد</span>
                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                      {Math.round((totalPaid / advance.amount) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(totalPaid / advance.amount) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* حالة السداد */}
                {advance.remainingAmount === 0 && (
                  <div className="mt-3 flex items-center justify-center">
                    <span className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      مسددة بالكامل
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {filteredAdvances.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                {language === 'ar' ? 'لا توجد سلف مطابقة لمعايير البحث' : 'No advances match the search criteria'}
              </p>
            </div>
          )}
        </div>

        {/* تفاصيل المدفوعات */}
        {filteredAdvances.some(advance => advance.payments.length > 0) && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              تفاصيل المدفوعات
            </h2>
            <div className="space-y-6">
              {filteredAdvances.map((advance) =>
                advance.payments.length > 0 && (
                  <div key={advance.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    {/* رأس السلفة */}
                    <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {getEmployeeName(advance.employeeId)} - {getAdvanceTypeText(advance.type)}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            المبلغ الإجمالي: {advance.amount.toLocaleString()} ريال |
                            المدفوع: {(advance.amount - advance.remainingAmount).toLocaleString()} ريال |
                            المتبقي: {advance.remainingAmount.toLocaleString()} ريال
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${advance.remainingAmount === 0
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                            }`}>
                            {advance.remainingAmount === 0 ? 'مسددة بالكامل' : 'سداد جزئي'}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {advance.payments.length} دفعة
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* جدول المدفوعات */}
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              #
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              المبلغ
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              التاريخ
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              طريقة السداد
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              رقم العملية
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              الحالة
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {advance.payments.map((payment, index) => (
                            <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {index + 1}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {payment.amount.toLocaleString()} ريال
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {new Date(payment.date).toLocaleDateString('ar-SA', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                  {getPaymentTypeText(payment.type)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                <span className="font-mono text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                  {payment.operationNumber || '-'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-1">
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  <span className="text-sm text-green-600 dark:text-green-400">مؤكد</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* ملخص السلفة */}
                    <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          إجمالي المدفوعات: {advance.payments.length} دفعة
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          المجموع: {(advance.amount - advance.remainingAmount).toLocaleString()} ريال
                        </span>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancesList;