// أنواع البيانات الأساسية
export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'manager' | 'employee';
  permissions: Permission[];
  isActive: boolean;
}

export interface Permission {
  module: string;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export interface Employee {
  id: string;
  employeeNumber: string; // EMP0001
  // البيانات الإدارية
  firstName: string;
  secondName: string;
  thirdName?: string;
  lastName: string;
  nationality: string;
  gender: 'male' | 'female';
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  idNumber: string;
  birthDate: string;
  professionInResidence: string;
  residenceExpiryDate: string;
  address?: string;
  email?: string;
  mobile?: string;
  
  // البيانات الوظيفية
  jobTitle?: string;
  department?: string;
  workStartDate?: string;
  workEndDate?: string; // تاريخ انتهاء الخدمة
  qualification: string;
  employeeStatus: 'active' | 'resigned' | 'terminated' | 'absent';
  sponsorshipStatus: 'internal' | 'external';
  employmentDate?: string;
  isActive: boolean;
  
  // البيانات المالية
  bankName?: string;
  bankAccountIBAN?: string;
  basicSalary?: number;
  housingAllowance?: number | 'provided';
  transportAllowance?: number | 'provided';
  
  // المرفقات
  attachments?: {
    contract?: string;
    workDocument?: string;
    bankAccount?: string;
    residence?: string;
    qualification?: string;
  };
}

export interface Vehicle {
  id: string;
  serialNumber: number;
  ownerId: string;
  ownerName?: string; // اسم مالك المركبة
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  type: 'sedan' | 'suv' | 'truck' | 'dyna' | 'van';
  status: 'working' | 'broken' | 'sold';
  mileage: number;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  ownership: 'company' | 'external';
  ownershipType: 'alqaoot_company' | 'bank' | 'employee'; // نوع الملكية
  purchaseDate?: string;
  value?: number;
  saleDate?: string; // تاريخ بيع المركبة
  saleValue?: number; // قيمة بيع المركبة
}

// نموذج تفاويض المركبات
export interface VehicleAuthorization {
  id: string;
  vehicleId: string; // ربط بالمركبة

  // الاستمارة
  registrationExpiryDate?: string;
  registrationStatus: 'valid' | 'expired' | 'expiring_soon';

  // الفحص الدوري
  inspectionExpiryDate?: string;
  inspectionStatus: 'valid' | 'expired' | 'expiring_soon';

  // كرت التشغيل
  operatingCardExpiryDate?: string;
  operatingCardStatus: 'valid' | 'expired' | 'expiring_soon';

  createdAt: string;
  updatedAt: string;
}

// نموذج تفاويض المركبات (التصاريح)
export interface VehiclePermit {
  id: string;
  vehicleId: string;
  permitType: 'local' | 'external' | 'actual_user';
  startDate: string;
  endDate?: string; // اختياري للمستخدم الفعلي
  attachments: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// نموذج تأمين المركبات
export interface VehicleInsurance {
  id: string;
  vehicleId: string;
  insuranceCompany: string;
  expiryDate: string;
  attachments: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// نموذج كروت التشغيل
export interface VehicleOperatingCard {
  id: string;
  vehicleId: string;
  cardNumber: string;
  startDate: string;
  expiryDate: string;
  attachments: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// نموذج بطاقات السائقين
export interface DriverCard {
  id: string;
  vehicleId: string;
  cardNumber: string;
  startDate: string;
  expiryDate: string;
  attachments: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Authorization {
  id: string;
  employeeId: string;
  vehicleId: string;
  type: 'local' | 'international';
  startDate: string;
  endDate: string;
  attachments?: string[];
}

export interface Driver {
  id: string;
  employeeId: string;
  licenseNumber: string;
  expiryDate: string;
  status: 'valid' | 'expired';
  attachments?: string[];
}

export interface Advance {
  id: string;
  employeeId: string;
  type: 'work_permit_fees' | 'residence_renewal_fees' | 'traffic_violation_fees' | 'transport_authority_violation_fees' | 'medical_insurance_fees' | 'car_insurance_fees' | 'exit_reentry_visa_fees' | 'personal_advance' | 'other_fees';
  customDescription?: string; // وصف مخصص عند اختيار "أخرى"
  amount: number;
  date: string;
  payments: Payment[];
  remainingAmount: number;
}

export interface Payment {
  id: string;
  advanceId: string;
  amount: number;
  date: string;
  type: 'bank_transfer' | 'receipt';
  operationNumber?: string;
  attachment?: string;
}

export interface ServiceRecord {
  id: string;
  employeeId: string;
  serviceDate: string;
  serviceType: 'transfer_document' | 'vehicle_form_renewal' | 'internal_vehicle_authorization' | 'external_vehicle_authorization' | 'add_actual_user' | 'operation_card_renewal' | 'driver_card_renewal' | 'chamber_of_commerce_certification' | 'passport_info_transfer';
  cost: number;
  paymentType: 'cash' | 'bank_transfer' | 'company_account' | 'deducted_from_salary';
  description?: string;
  status: 'paid' | 'unpaid';
  paidAmount?: number; // المبلغ المسدد للسداد الجزئي
  remainingAmount?: number; // المبلغ المتبقي للسداد الجزئي
  createdAt: string;
  updatedAt: string;
}

export interface Due {
  id: string;
  targetType: 'employee' | 'vehicle'; // نوع المستحق: موظف أو مركبة
  targetId: string; // معرف الموظف أو المركبة
  amount: number;
  description: string;
  year: string; // السنة
  date: string;
  payments: DuePayment[];
  remainingAmount: number;
  status: 'active' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface DuePayment {
  id: string;
  dueId: string;
  amount: number;
  date: string;
  type: 'bank_transfer' | 'receipt';
  operationNumber?: string;
  attachment?: string;
}

export interface CompanyLicense {
  id: string;
  type: 'commercial_register' | 'municipal_license' | 'transport_authority' | 'civil_defense' | 'tax_certificate';
  name: string;
  number: string;
  expiryDate: string;
  status: 'valid' | 'expired';
  attachments?: string[];
}

export interface ShippingBill {
  id: string;
  billNumber: string;
  date: string;
  
  // بيانات الشاحن
  shipper: {
    name: string;
    address: string;
    phone: string;
    email?: string;
  };
  
  // بيانات المستلم
  receiver: {
    name: string;
    address: string;
    phone: string;
    email?: string;
  };
  
  // تفاصيل الشحنة
  pickupLocation: string;
  deliveryLocation: string;
  shippingMethod: 'sea' | 'air' | 'land';
  transportMeans: 'container' | 'truck' | 'plane' | 'other';
  containerCount: number;
  totalWeight: number;
  volume: number;
  description: string;
  trackingNumber?: string;
  
  // تفاصيل الحاويات
  containers: Container[];
  
  // تعليمات الشحن
  shippingInstructions?: string;
  
  // البيانات المالية
  financial: {
    shipmentValue: number;
    currency: string;
    paymentMethod: 'cash' | 'bank_transfer' | 'check' | 'electronic' | 'other';
    transportCost: number;
    insuranceCost: number;
    customsCost: number;
    totalCost: number;
    paymentStatus: 'paid' | 'unpaid' | 'partial';
    financialNotes?: string;
  };
  
  // التوقيعات
  signatures: {
    shipper: { name: string; signature?: string; date: string };
    carrier: { name: string; signature?: string; date: string };
    receiver: { name: string; signature?: string; date: string };
  };
  
  // المرفقات
  attachments?: string[];
}

export interface Container {
  id: string;
  number: string;
  type: string;
  weight: number;
  dimensions: string;
  notes?: string;
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  totalVehicles: number;
  workingVehicles: number;
  totalAdvances: number;
  totalAdvanceAmount: number;
  paidAdvanceAmount: number;
  unpaidAdvanceAmount: number;
  expiredDocuments: number;
  totalShippingBills: number;
  // إحصائيات الخدمات
  totalServices: number;
  totalServicesAmount: number;
  paidServicesAmount: number;
  unpaidServicesAmount: number;
}

// أنواع بيانات الخدمات
export interface Service {
  id: string;
  name: string;
  description: string;
  category: 'logistics' | 'transport' | 'documentation' | 'customs' | 'other';
  basePrice: number;
  isActive: boolean;
  estimatedDuration?: string; // مثل "3-5 أيام عمل"
  requirements?: string[]; // متطلبات الخدمة
  createdAt: string;
  updatedAt: string;
}

export interface ServiceRequest {
  id: string;
  serviceId: string;
  serviceName: string;
  requestNumber: string; // رقم الطلب مثل SR-2024-001

  // بيانات العميل
  client: {
    name: string;
    email?: string;
    phone: string;
    address?: string;
    companyName?: string;
    taxNumber?: string;
  };

  // تفاصيل الطلب
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  requestedDate: string;
  expectedCompletionDate?: string;

  // الحالة والمتابعة
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled' | 'rejected';
  assignedTo?: string; // معرف الموظف المسؤول
  notes?: string;

  // التكلفة
  estimatedCost: number;
  finalCost?: number;

  // التواريخ
  createdAt: string;
  updatedAt: string;
  completedAt?: string;

  // المرفقات
  attachments?: string[];
}

export interface ServicePayment {
  id: string;
  serviceRequestId: string;
  requestNumber: string;

  // بيانات الدفع
  amount: number;
  paymentMethod: 'cash' | 'bank_transfer' | 'check' | 'credit_card' | 'online';
  paymentDate: string;

  // تفاصيل الدفع
  transactionNumber?: string; // رقم العملية للتحويل البنكي
  checkNumber?: string; // رقم الشيك
  bankName?: string;

  // الحالة
  status: 'pending' | 'completed' | 'failed' | 'refunded';

  // بيانات إضافية
  notes?: string;
  receiptNumber?: string; // رقم الإيصال

  // المرفقات
  attachments?: string[]; // صور الإيصالات، إثباتات التحويل، إلخ

  // التواريخ
  createdAt: string;
  updatedAt: string;

  // بيانات المحاسبة
  accountingEntry?: {
    debitAccount: string;
    creditAccount: string;
    reference: string;
  };
}

// أنواع بيانات الإعدادات والنظام
export interface SystemSettings {
  id: string;
  // إعدادات عامة
  systemName: string;
  systemVersion: string;
  defaultLanguage: 'ar' | 'en';
  defaultTheme: 'light' | 'dark';
  timezone: string;
  dateFormat: string;
  currency: string;

  // إعدادات الأمان
  security: {
    passwordMinLength: number;
    passwordRequireUppercase: boolean;
    passwordRequireNumbers: boolean;
    passwordRequireSymbols: boolean;
    sessionTimeout: number; // بالدقائق
    maxLoginAttempts: number;
    lockoutDuration: number; // بالدقائق
    enableTwoFactor: boolean;
  };

  // إعدادات النسخ الاحتياطي
  backup: {
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    backupTime: string;
    retentionDays: number;
    backupLocation: string;
  };

  // إعدادات الإشعارات
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    systemAlerts: boolean;
    documentExpiry: boolean;
    paymentReminders: boolean;
  };

  // إعدادات التكامل
  integrations: {
    emailProvider: string;
    smsProvider: string;
    paymentGateway: string;
    cloudStorage: string;
  };

  updatedAt: string;
  updatedBy: string;
}

export interface CompanyInfo {
  id: string;
  // معلومات أساسية
  name: string;
  nameEn?: string;
  logo?: string;

  // معلومات الاتصال
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
  fax?: string;
  email: string;
  website?: string;

  // معلومات قانونية
  commercialRegister: string;
  taxNumber: string;
  vatNumber?: string;

  // معلومات بنكية
  bankAccounts: BankAccount[];

  // إعدادات الفواتير
  invoiceSettings: {
    prefix: string;
    startNumber: number;
    template: string;
    footer: string;
    terms: string;
  };

  updatedAt: string;
  updatedBy: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  iban: string;
  swiftCode?: string;
  currency: string;
  isDefault: boolean;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
  userAgent: string;
}

// مصاريف التشغيل
export interface OperatingExpense {
  id: string;
  category: 'employee_expenses' | 'company_expenses';
  date: string;
  type: 'salary' | 'electricity_bill' | 'office_rent' | 'labor_office_fees' | 'residence_renewal_fees' | 'tam_subscription' | 'qiwa_subscription' | 'internet_subscription';
  amount: number;
  description?: string;
  employeeId?: string; // فقط في حالة مصاريف الموظف
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}