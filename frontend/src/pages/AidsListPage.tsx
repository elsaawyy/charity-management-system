import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Edit, Trash2, Eye, FileDown, Printer } from 'lucide-react';
import caseService from '@/services/caseService';

export default function AidsListPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [aidTypes, setAidTypes] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const { data, refetch } = useQuery({
    queryKey: ['aids', page, search, selectedType, startDate, endDate],
    queryFn: () => caseService.getAids({ 
      page, 
      size: pageSize, 
      search,
      aid_type_id: selectedType || undefined,
      start_date: startDate || undefined,
      end_date: endDate || undefined
    }),
  });

  useEffect(() => {
    loadAidTypes();
  }, []);

  const loadAidTypes = async () => {
    const res = await caseService.getAidTypes();
    setAidTypes(res.data);
  };

  const handleDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذه المساعدة؟')) {
      await caseService.deleteAid(id);
      refetch();
    }
  };

const handlePrintReceipt = async (id: number) => {
  try {
    const res = await caseService.getAidReceipt(id);
    const receipt = res.data;
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      alert('الرجاء السماح للنوافذ المنبثقة');
      return;
    }
    
    printWindow.document.write(printReceiptHTML(receipt));
    printWindow.document.close();
    printWindow.focus();
    
    // Auto print when content loads
    printWindow.onload = () => {
      printWindow.print();
    };
  } catch (error) {
    console.error('Error printing receipt:', error);
    alert('حدث خطأ في طباعة الإيصال');
  }
};

const printReceiptHTML = (receipt: any) => {
  return `
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <title>إيصال مساعدة - ${receipt.receipt_number}</title>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Arial', sans-serif; 
          margin: 0; 
          padding: 20px;
          background: #f5f5f5;
        }
        .receipt { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white;
          border: 1px solid #ddd;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header { 
          text-align: center; 
          border-bottom: 3px solid #2C3E50; 
          padding: 20px;
          background: #f8f9fa;
        }
        .title { 
          font-size: 24px; 
          font-weight: bold; 
          color: #2C3E50; 
        }
        .subtitle { 
          color: #666; 
          margin-top: 5px;
          font-size: 14px;
        }
        .receipt-title {
          background: #2C3E50;
          color: white;
          text-align: center;
          padding: 10px;
          font-size: 18px;
          font-weight: bold;
        }
        .content { padding: 20px; }
        .info-row { 
          display: flex; 
          justify-content: space-between; 
          margin-bottom: 12px;
          padding: 8px;
          border-bottom: 1px dashed #eee;
        }
        .label { 
          font-weight: bold; 
          color: #555; 
          font-size: 14px;
        }
        .value { 
          color: #333; 
          font-size: 14px;
        }
        .amount { 
          font-size: 20px; 
          font-weight: bold; 
          color: #27AE60; 
        }
        .footer { 
          margin-top: 20px; 
          text-align: center; 
          border-top: 1px solid #ddd; 
          padding: 15px;
          background: #f8f9fa;
          font-size: 12px;
          color: #666;
        }
        .signature { 
          margin-top: 30px; 
          display: flex; 
          justify-content: space-between;
          padding: 0 20px 20px 20px;
        }
        .signature-line {
          text-align: center;
        }
        .signature-text {
          margin-top: 40px;
          font-size: 12px;
          color: #666;
        }
        @media print {
          body { background: white; padding: 0; }
          .receipt { box-shadow: none; margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="receipt">
        <div class="header">
          <div class="title">${receipt.organization_name || 'جمعية النور المحمدي'}</div>
          <div class="subtitle">إيصال مساعدة</div>
        </div>
        <div class="receipt-title">
          ${receipt.aid_type === 'مساعدات مالية' ? 'إيصال صرف مساعدة مالية' : 'إيصال استلام مساعدة عينية'}
        </div>
        <div class="content">
          <div class="info-row">
            <span class="label">رقم الإيصال:</span>
            <span class="value">${receipt.receipt_number}</span>
          </div>
          <div class="info-row">
            <span class="label">التاريخ:</span>
            <span class="value">${receipt.receipt_date}</span>
          </div>
          <div class="info-row">
            <span class="label">اسم المستفيد:</span>
            <span class="value">${receipt.case_name}</span>
          </div>
          <div class="info-row">
            <span class="label">رقم الملف:</span>
            <span class="value">${receipt.case_file_number}</span>
          </div>
          <div class="info-row">
            <span class="label">رقم الهاتف:</span>
            <span class="value">${receipt.case_phone}</span>
          </div>
          ${receipt.case_address ? `
          <div class="info-row">
            <span class="label">العنوان:</span>
            <span class="value">${receipt.case_address}</span>
          </div>
          ` : ''}
          <div class="info-row">
            <span class="label">نوع المساعدة:</span>
            <span class="value">${receipt.aid_type}</span>
          </div>
          ${receipt.amount ? `
          <div class="info-row">
            <span class="label">المبلغ:</span>
            <span class="value amount">${receipt.amount} ج.م</span>
          </div>
          ` : ''}
          ${receipt.quantity_or_description ? `
          <div class="info-row">
            <span class="label">الوصف:</span>
            <span class="value">${receipt.quantity_or_description}</span>
          </div>
          ` : ''}
          <div class="info-row">
            <span class="label">بواسطة:</span>
            <span class="value">${receipt.registered_by}</span>
          </div>
        </div>
        <div class="signature">
          <div class="signature-line">
            <div>_________________</div>
            <div class="signature-text">توقيع المستلم</div>
          </div>
          <div class="signature-line">
            <div>_________________</div>
            <div class="signature-text">ختم الجمعية</div>
          </div>
        </div>
        <div class="footer">
          ${receipt.organization_phone || '0123456789'} | ${receipt.organization_email || 'info@charity.org'}
        </div>
      </div>
      <div class="no-print" style="text-align: center; margin-top: 20px;">
        <button onclick="window.print()" style="padding: 10px 20px; margin: 5px; background: #2C3E50; color: white; border: none; border-radius: 5px; cursor: pointer;">طباعة</button>
        <button onclick="window.close()" style="padding: 10px 20px; margin: 5px; background: #ccc; border: none; border-radius: 5px; cursor: pointer;">إغلاق</button>
      </div>
    </body>
    </html>
  `;
};


  const aids = data?.data?.items || [];
  const total = data?.data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">المساعدات العامة</h1>
        <Link
          to="/aids/create"
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-light"
        >
          <Plus size={20} />
          إضافة مساعدة جديدة
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">بحث</label>
            <div className="relative">
              <Search className="absolute right-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="بحث..."
                className="w-full pr-10 pl-4 py-2 border rounded-lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">نوع المساعدة</label>
            <select
              className="w-full px-3 py-2 border rounded-lg"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">الكل</option>
              {aidTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">من تاريخ</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">إلى تاريخ</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Aids Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right">رقم الإيصال</th>
                <th className="px-6 py-3 text-right">المستفيد</th>
                <th className="px-6 py-3 text-right">رقم الملف</th>
                <th className="px-6 py-3 text-right">نوع المساعدة</th>
                <th className="px-6 py-3 text-right">المبلغ/الوصف</th>
                <th className="px-6 py-3 text-right">التاريخ</th>
                <th className="px-6 py-3 text-right">بواسطة</th>
                <th className="px-6 py-3 text-right">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {aids.map((aid: any) => (
                <tr key={aid.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">REC-{aid.id}</td>
                  <td className="px-6 py-4">{aid.case_full_name}</td>
                  <td className="px-6 py-4">{aid.case_file_number}</td>
                  <td className="px-6 py-4">{aid.aid_type_name}</td>
                  <td className="px-6 py-4">
                    {aid.amount ? `${aid.amount} ج.م` : aid.quantity_or_description}
                  </td>
                  <td className="px-6 py-4">{aid.aid_date}</td>
                  <td className="px-6 py-4">{aid.registered_by_name}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePrintReceipt(aid.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Printer size={18} />
                      </button>
                      <Link
                        to={`/aids/${aid.id}/edit`}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(aid.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 border-t">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
            >
              السابق
            </button>
            <span>الصفحة {page} من {totalPages}</span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
            >
              التالي
            </button>
          </div>
        )}
      </div>
    </div>
  );
}