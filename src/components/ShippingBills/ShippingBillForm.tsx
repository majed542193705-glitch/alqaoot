import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Upload, FileText } from 'lucide-react';
import { ShippingBill, Container } from '../../types';

interface ShippingBillFormProps {
  bill: ShippingBill | null;
  onSave: (bill: Omit<ShippingBill, 'id'>) => void;
  onCancel: () => void;
}

const ShippingBillForm: React.FC<ShippingBillFormProps> = ({
  bill,
  onSave,
  onCancel
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState<Omit<ShippingBill, 'id'>>({
    billNumber: '',
    date: new Date().toISOString().split('T')[0],
    shipper: {
      name: '',
      address: '',
      phone: '',
      email: ''
    },
    receiver: {
      name: '',
      address: '',
      phone: '',
      email: ''
    },
    pickupLocation: '',
    deliveryLocation: '',
    shippingMethod: 'land',
    transportMeans: 'truck',
    containerCount: 1,
    totalWeight: 0,
    volume: 0,
    description: '',
    trackingNumber: '',
    containers: [],
    shippingInstructions: '',
    financial: {
      shipmentValue: 0,
      currency: 'SAR',
      paymentMethod: 'cash',
      transportCost: 0,
      insuranceCost: 0,
      customsCost: 0,
      totalCost: 0,
      paymentStatus: 'unpaid',
      financialNotes: ''
    },
    signatures: {
      shipper: { name: '', date: '' },
      carrier: { name: 'مؤسسة القعوط للخدمات اللوجستية', date: new Date().toISOString().split('T')[0] },
      receiver: { name: '', date: '' }
    },
    attachments: []
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (bill) {
      setFormData(bill);
    } else {
      // إنشاء رقم بوليصة تلقائي
      const billNumber = `SB-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`;
      setFormData(prev => ({ ...prev, billNumber }));
    }
  }, [bill]);

  // حساب التكلفة الإجمالية تلقائياً
  useEffect(() => {
    const totalCost = formData.financial.transportCost + 
                     formData.financial.insuranceCost + 
                     formData.financial.customsCost;
    setFormData(prev => ({
      ...prev,
      financial: {
        ...prev.financial,
        totalCost
      }
    }));
  }, [formData.financial.transportCost, formData.financial.insuranceCost, formData.financial.customsCost]);

  const tabs = [
    { id: 'basic', label: 'البيانات الأساسية' },
    { id: 'shipping', label: 'تفاصيل الشحن' },
    { id: 'containers', label: 'الحاويات' },
    { id: 'financial', label: 'البيانات المالية' },
    { id: 'signatures', label: 'التوقيعات' }
  ];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.billNumber.trim()) {
      newErrors.billNumber = 'رقم البوليصة مطلوب';
    }

    if (!formData.shipper.name.trim()) {
      newErrors.shipperName = 'اسم الشاحن مطلوب';
    }

    if (!formData.shipper.phone.trim()) {
      newErrors.shipperPhone = 'هاتف الشاحن مطلوب';
    }

    if (!formData.receiver.name.trim()) {
      newErrors.receiverName = 'اسم المستلم مطلوب';
    }

    if (!formData.receiver.phone.trim()) {
      newErrors.receiverPhone = 'هاتف المستلم مطلوب';
    }

    if (!formData.pickupLocation.trim()) {
      newErrors.pickupLocation = 'موقع الاستلام مطلوب';
    }

    if (!formData.deliveryLocation.trim()) {
      newErrors.deliveryLocation = 'موقع التسليم مطلوب';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'وصف الشحنة مطلوب';
    }

    if (formData.totalWeight <= 0) {
      newErrors.totalWeight = 'الوزن الإجمالي يجب أن يكون أكبر من صفر';
    }

    if (formData.financial.shipmentValue <= 0) {
      newErrors.shipmentValue = 'قيمة الشحنة يجب أن تكون أكبر من صفر';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleInputChange = (field: string, value: any, section?: string) => {
    if (section) {
      // التعامل مع التوقيعات المتداخلة
      if (section.includes('.')) {
        const [mainSection, subSection] = section.split('.');
        setFormData(prev => ({
          ...prev,
          [mainSection]: {
            ...prev[mainSection as keyof typeof prev],
            [subSection]: {
              ...(prev[mainSection as keyof typeof prev] as any)[subSection],
              [field]: value
            }
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [section]: {
            ...prev[section as keyof typeof prev],
            [field]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // إزالة رسالة الخطأ عند التعديل
    const errorKey = section ? `${section.replace('.', '')}${field.charAt(0).toUpperCase() + field.slice(1)}` : field;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: ''
      }));
    }
  };

  const addContainer = () => {
    const newContainer: Container = {
      id: Date.now().toString(),
      number: `CONT-${String(formData.containers.length + 1).padStart(3, '0')}`,
      type: 'عادي',
      weight: 0,
      dimensions: '',
      notes: ''
    };
    setFormData(prev => ({
      ...prev,
      containers: [...prev.containers, newContainer]
    }));
  };

  const removeContainer = (id: string) => {
    setFormData(prev => ({
      ...prev,
      containers: prev.containers.filter(container => container.id !== id)
    }));
  };

  const updateContainer = (id: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      containers: prev.containers.map(container =>
        container.id === id ? { ...container, [field]: value } : container
      )
    }));
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            رقم البوليصة *
          </label>
          <input
            type="text"
            value={formData.billNumber}
            onChange={(e) => handleInputChange('billNumber', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.billNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="رقم البوليصة"
          />
          {errors.billNumber && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.billNumber}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            تاريخ البوليصة *
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* بيانات الشاحن */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">بيانات الشاحن</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              اسم الشاحن *
            </label>
            <input
              type="text"
              value={formData.shipper.name}
              onChange={(e) => handleInputChange('name', e.target.value, 'shipper')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                errors.shipperName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="اسم الشاحن"
            />
            {errors.shipperName && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.shipperName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              هاتف الشاحن *
            </label>
            <input
              type="tel"
              value={formData.shipper.phone}
              onChange={(e) => handleInputChange('phone', e.target.value, 'shipper')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                errors.shipperPhone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="رقم الهاتف"
            />
            {errors.shipperPhone && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.shipperPhone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              عنوان الشاحن
            </label>
            <input
              type="text"
              value={formData.shipper.address}
              onChange={(e) => handleInputChange('address', e.target.value, 'shipper')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="العنوان"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              بريد الشاحن الإلكتروني
            </label>
            <input
              type="email"
              value={formData.shipper.email}
              onChange={(e) => handleInputChange('email', e.target.value, 'shipper')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="البريد الإلكتروني"
            />
          </div>
        </div>
      </div>

      {/* بيانات المستلم */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">بيانات المستلم</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              اسم المستلم *
            </label>
            <input
              type="text"
              value={formData.receiver.name}
              onChange={(e) => handleInputChange('name', e.target.value, 'receiver')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                errors.receiverName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="اسم المستلم"
            />
            {errors.receiverName && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.receiverName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              هاتف المستلم *
            </label>
            <input
              type="tel"
              value={formData.receiver.phone}
              onChange={(e) => handleInputChange('phone', e.target.value, 'receiver')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                errors.receiverPhone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="رقم الهاتف"
            />
            {errors.receiverPhone && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.receiverPhone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              عنوان المستلم
            </label>
            <input
              type="text"
              value={formData.receiver.address}
              onChange={(e) => handleInputChange('address', e.target.value, 'receiver')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="العنوان"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              بريد المستلم الإلكتروني
            </label>
            <input
              type="email"
              value={formData.receiver.email}
              onChange={(e) => handleInputChange('email', e.target.value, 'receiver')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="البريد الإلكتروني"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderShippingDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            موقع الاستلام *
          </label>
          <input
            type="text"
            value={formData.pickupLocation}
            onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.pickupLocation ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="موقع الاستلام"
          />
          {errors.pickupLocation && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.pickupLocation}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            موقع التسليم *
          </label>
          <input
            type="text"
            value={formData.deliveryLocation}
            onChange={(e) => handleInputChange('deliveryLocation', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.deliveryLocation ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="موقع التسليم"
          />
          {errors.deliveryLocation && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.deliveryLocation}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            طريقة الشحن
          </label>
          <select
            value={formData.shippingMethod}
            onChange={(e) => handleInputChange('shippingMethod', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="land">بري</option>
            <option value="sea">بحري</option>
            <option value="air">جوي</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            وسيلة النقل
          </label>
          <select
            value={formData.transportMeans}
            onChange={(e) => handleInputChange('transportMeans', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="truck">شاحنة</option>
            <option value="container">حاوية</option>
            <option value="plane">طائرة</option>
            <option value="other">أخرى</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            الوزن الإجمالي (كيلو) *
          </label>
          <input
            type="number"
            value={formData.totalWeight}
            onChange={(e) => handleInputChange('totalWeight', parseFloat(e.target.value) || 0)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.totalWeight ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="الوزن بالكيلو"
          />
          {errors.totalWeight && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.totalWeight}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            الحجم (متر مكعب)
          </label>
          <input
            type="number"
            value={formData.volume}
            onChange={(e) => handleInputChange('volume', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="الحجم بالمتر المكعب"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            رقم التتبع
          </label>
          <input
            type="text"
            value={formData.trackingNumber}
            onChange={(e) => handleInputChange('trackingNumber', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="رقم التتبع"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            عدد الحاويات
          </label>
          <input
            type="number"
            value={formData.containerCount}
            onChange={(e) => handleInputChange('containerCount', parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            min="1"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          وصف الشحنة *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={3}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
            errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
          placeholder="وصف تفصيلي للشحنة"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          تعليمات الشحن
        </label>
        <textarea
          value={formData.shippingInstructions}
          onChange={(e) => handleInputChange('shippingInstructions', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          placeholder="تعليمات خاصة للشحن"
        />
      </div>
    </div>
  );

  const renderContainers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">الحاويات</h3>
        <button
          type="button"
          onClick={addContainer}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          إضافة حاوية
        </button>
      </div>

      {formData.containers.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          لا توجد حاويات. انقر على "إضافة حاوية" لإضافة حاوية جديدة.
        </div>
      ) : (
        <div className="space-y-4">
          {formData.containers.map((container, index) => (
            <div key={container.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900 dark:text-white">حاوية {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeContainer(container.id)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    رقم الحاوية
                  </label>
                  <input
                    type="text"
                    value={container.number}
                    onChange={(e) => updateContainer(container.id, 'number', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="رقم الحاوية"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    نوع الحاوية
                  </label>
                  <select
                    value={container.type}
                    onChange={(e) => updateContainer(container.id, 'type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="عادي">عادي</option>
                    <option value="مبرد">مبرد</option>
                    <option value="خطر">مواد خطرة</option>
                    <option value="سائل">سائل</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الوزن (كيلو)
                  </label>
                  <input
                    type="number"
                    value={container.weight}
                    onChange={(e) => updateContainer(container.id, 'weight', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="الوزن"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    الأبعاد
                  </label>
                  <input
                    type="text"
                    value={container.dimensions}
                    onChange={(e) => updateContainer(container.id, 'dimensions', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="الطول x العرض x الارتفاع"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ملاحظات
                  </label>
                  <input
                    type="text"
                    value={container.notes}
                    onChange={(e) => updateContainer(container.id, 'notes', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="ملاحظات إضافية"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderFinancialInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            قيمة الشحنة *
          </label>
          <input
            type="number"
            value={formData.financial.shipmentValue}
            onChange={(e) => handleInputChange('shipmentValue', parseFloat(e.target.value) || 0, 'financial')}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.shipmentValue ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="قيمة الشحنة"
          />
          {errors.shipmentValue && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.shipmentValue}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            العملة
          </label>
          <select
            value={formData.financial.currency}
            onChange={(e) => handleInputChange('currency', e.target.value, 'financial')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="SAR">ريال سعودي</option>
            <option value="USD">دولار أمريكي</option>
            <option value="EUR">يورو</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            تكلفة النقل
          </label>
          <input
            type="number"
            value={formData.financial.transportCost}
            onChange={(e) => handleInputChange('transportCost', parseFloat(e.target.value) || 0, 'financial')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="تكلفة النقل"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            تكلفة التأمين
          </label>
          <input
            type="number"
            value={formData.financial.insuranceCost}
            onChange={(e) => handleInputChange('insuranceCost', parseFloat(e.target.value) || 0, 'financial')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="تكلفة التأمين"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            الرسوم الجمركية
          </label>
          <input
            type="number"
            value={formData.financial.customsCost}
            onChange={(e) => handleInputChange('customsCost', parseFloat(e.target.value) || 0, 'financial')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="الرسوم الجمركية"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            التكلفة الإجمالية
          </label>
          <input
            type="number"
            value={formData.financial.totalCost}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
            placeholder="يتم حسابها تلقائياً"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            طريقة الدفع
          </label>
          <select
            value={formData.financial.paymentMethod}
            onChange={(e) => handleInputChange('paymentMethod', e.target.value, 'financial')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="cash">نقداً</option>
            <option value="bank_transfer">تحويل بنكي</option>
            <option value="check">شيك</option>
            <option value="electronic">دفع إلكتروني</option>
            <option value="other">أخرى</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            حالة الدفع
          </label>
          <select
            value={formData.financial.paymentStatus}
            onChange={(e) => handleInputChange('paymentStatus', e.target.value, 'financial')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="unpaid">غير مدفوع</option>
            <option value="paid">مدفوع</option>
            <option value="partial">مدفوع جزئياً</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          ملاحظات مالية
        </label>
        <textarea
          value={formData.financial.financialNotes}
          onChange={(e) => handleInputChange('financialNotes', e.target.value, 'financial')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          placeholder="ملاحظات مالية إضافية"
        />
      </div>
    </div>
  );

  const renderSignatures = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* توقيع الشاحن */}
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">توقيع الشاحن</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                اسم الموقع
              </label>
              <input
                type="text"
                value={formData.signatures.shipper.name}
                onChange={(e) => handleInputChange('name', e.target.value, 'signatures.shipper')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="اسم الموقع"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                تاريخ التوقيع
              </label>
              <input
                type="date"
                value={formData.signatures.shipper.date}
                onChange={(e) => handleInputChange('date', e.target.value, 'signatures.shipper')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* توقيع الناقل */}
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">توقيع الناقل</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                اسم الموقع
              </label>
              <input
                type="text"
                value={formData.signatures.carrier.name}
                onChange={(e) => handleInputChange('name', e.target.value, 'signatures.carrier')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="اسم الموقع"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                تاريخ التوقيع
              </label>
              <input
                type="date"
                value={formData.signatures.carrier.date}
                onChange={(e) => handleInputChange('date', e.target.value, 'signatures.carrier')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* توقيع المستلم */}
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">توقيع المستلم</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                اسم الموقع
              </label>
              <input
                type="text"
                value={formData.signatures.receiver.name}
                onChange={(e) => handleInputChange('name', e.target.value, 'signatures.receiver')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="اسم الموقع"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                تاريخ التوقيع
              </label>
              <input
                type="date"
                value={formData.signatures.receiver.date}
                onChange={(e) => handleInputChange('date', e.target.value, 'signatures.receiver')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* المرفقات */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          المرفقات
        </label>

        {/* زر رفع الملفات */}
        <div className="mb-4">
          <label className="flex items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">انقر لرفع الملفات</span> أو اسحب وأفلت
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PDF, DOC, DOCX, JPG, PNG (الحد الأقصى 10MB)
              </p>
            </div>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => {
                const files = e.target.files;
                if (files) {
                  const newAttachments = Array.from(files).map(file => file.name);
                  setFormData(prev => ({
                    ...prev,
                    attachments: [...(prev.attachments || []), ...newAttachments]
                  }));
                }
              }}
              className="hidden"
            />
          </label>
        </div>

        {/* قائمة المرفقات */}
        {formData.attachments && formData.attachments.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              الملفات المرفقة ({formData.attachments.length})
            </h4>
            {formData.attachments.map((attachment, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-900 dark:text-white">
                    {attachment}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      attachments: prev.attachments?.filter((_, i) => i !== index) || []
                    }));
                  }}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* رأس النموذج */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {bill ? 'تعديل بوليصة الشحن' : 'إضافة بوليصة شحن جديدة'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* التبويبات */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 rtl:space-x-reverse px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* محتوى النموذج */}
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'basic' && renderBasicInfo()}
            {activeTab === 'shipping' && renderShippingDetails()}
            {activeTab === 'containers' && renderContainers()}
            {activeTab === 'financial' && renderFinancialInfo()}
            {activeTab === 'signatures' && renderSignatures()}
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
            >
              {bill ? 'تحديث' : 'إضافة'} البوليصة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShippingBillForm;
