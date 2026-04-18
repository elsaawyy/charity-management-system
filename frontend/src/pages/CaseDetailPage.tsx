import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, Trash2, ArrowRight, UserPlus, Briefcase } from 'lucide-react';
import caseService, { Case, FamilyMember, WorkRecord } from '@/services/caseService';
import FamilyMembersModal from '@/components/cases/FamilyMembersModal';
import WorkRecordsModal from '@/components/cases/WorkRecordsModal';

export default function CaseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [workRecords, setWorkRecords] = useState<WorkRecord[]>([]);
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [showWorkModal, setShowWorkModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [caseRes, familyRes, workRes] = await Promise.all([
        caseService.getCase(parseInt(id!)),
        caseService.getFamilyMembers(parseInt(id!)),
        caseService.getWorkRecords(parseInt(id!)),
      ]);
      setCaseData(caseRes.data);
      setFamilyMembers(familyRes.data);
      setWorkRecords(workRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('هل أنت متأكد من حذف هذه الحالة؟')) {
      await caseService.deleteCase(parseInt(id!));
      navigate('/cases');
    }
  };

const totalIncome = Number(caseData?.family_income || 0) + 
                     Number(caseData?.property_rental_income || 0) + 
                     Number(caseData?.other_income || 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">جاري التحميل...</div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">الحالة غير موجودة</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{caseData.full_name}</h1>
          <p className="text-gray-500">رقم الملف: {caseData.file_number}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/cases/${id}/edit`)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Edit size={18} />
            تعديل
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
          >
            <Trash2 size={18} />
            حذف
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">المعلومات الشخصية</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">الاسم الكامل</p>
                <p className="font-medium">{caseData.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">رقم الهاتف 1</p>
                <p className="font-medium">{caseData.phone_number_1}</p>
              </div>
              {caseData.phone_number_2 && (
                <div>
                  <p className="text-sm text-gray-500">رقم الهاتف 2</p>
                  <p className="font-medium">{caseData.phone_number_2}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">المدينة</p>
                <p className="font-medium">{caseData.city}</p>
              </div>
              {caseData.country && (
                <div>
                  <p className="text-sm text-gray-500">الدولة</p>
                  <p className="font-medium">{caseData.country}</p>
                </div>
              )}
              {caseData.street_address && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">العنوان</p>
                  <p className="font-medium">{caseData.street_address}</p>
                </div>
              )}
            </div>
          </div>

          {/* Housing & Income */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">السكن والدخل</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">نوع السكن</p>
                <p className="font-medium">{caseData.housing_type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">تاريخ الانضمام</p>
                <p className="font-medium">{caseData.join_date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">دخل الأسرة</p>
                <p className="font-medium">{caseData.family_income} ج.م</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">دخل الإيجار</p>
                <p className="font-medium">{caseData.property_rental_income} ج.م</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">دخل آخر</p>
                <p className="font-medium">{caseData.other_income} ج.م</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">إجمالي الدخل</p>
                <p className="font-bold text-primary">{totalIncome} ج.م</p>
              </div>
              {caseData.receives_government_aid && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">مساعدات حكومية</p>
                  <p className="font-medium">{caseData.government_aid_organization || 'نعم'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Monthly Aid */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">المساعدات الشهرية</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">مساعدات شهرية</p>
                <p className="font-medium">{caseData.is_monthly_aid ? 'نعم' : 'لا'}</p>
              </div>
              {caseData.is_monthly_aid && (
                <div>
                  <p className="text-sm text-gray-500">المبلغ الشهري</p>
                  <p className="font-bold text-primary">{caseData.monthly_aid_amount} ج.م</p>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {caseData.notes && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 border-b pb-2">ملاحظات</h2>
              <p>{caseData.notes}</p>
            </div>
          )}
        </div>

        {/* Right Column - Family & Work */}
        <div className="space-y-6">
          {/* Family Members */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-xl font-bold">أفراد الأسرة</h2>
              <button
                onClick={() => setShowFamilyModal(true)}
                className="text-primary hover:text-primary-light flex items-center gap-1"
              >
                <UserPlus size={18} />
                إضافة
              </button>
            </div>
{familyMembers.map((member) => (
  <div key={member.id} className="border rounded-lg p-3 space-y-1">
    <p className="font-bold text-lg">{member.name}</p>
    <div className="grid grid-cols-2 gap-2 text-sm">
      <p><span className="text-gray-500">الصلة:</span> {member.family_relation || member.family_relation}</p>
      {member.age && <p><span className="text-gray-500">العمر:</span> {member.age} سنة</p>}
      {member.marital_status && <p><span className="text-gray-500">الحالة الاجتماعية:</span> {member.marital_status}</p>}
      {member.school_or_university && <p className="col-span-2"><span className="text-gray-500">المدرسة/الجامعة:</span> {member.school_or_university}</p>}
      {member.notes && <p className="col-span-2"><span className="text-gray-500">ملاحظات:</span> {member.notes}</p>}
    </div>
  </div>
))}
          </div>

          {/* Work Records */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-xl font-bold">سجل العمل</h2>
              <button
                onClick={() => setShowWorkModal(true)}
                className="text-primary hover:text-primary-light flex items-center gap-1"
              >
                <Briefcase size={18} />
                إضافة
              </button>
            </div>
            {workRecords.length === 0 ? (
              <p className="text-gray-500 text-center py-4">لا يوجد سجل عمل</p>
            ) : (
              <div className="space-y-3">
                {workRecords.map((work) => (
  <div key={work.id} className="border rounded-lg p-3 space-y-1">
    <p className="font-bold text-lg">{work.job_title || 'وظيفة'}</p>
    <div className="grid grid-cols-2 gap-2 text-sm">
      <p><span className="text-gray-500">نوع الشخص:</span> {work.person_type}</p>
      {work.employer_name && <p className="col-span-2"><span className="text-gray-500">جهة العمل:</span> {work.employer_name}</p>}
      {work.employer_address && <p className="col-span-2"><span className="text-gray-500">العنوان:</span> {work.employer_address}</p>}
      {work.employer_phone && <p><span className="text-gray-500">الهاتف:</span> {work.employer_phone}</p>}
      {work.monthly_salary && <p><span className="text-gray-500">الراتب:</span> {work.monthly_salary} ج.م</p>}
    </div>
  </div>
))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showFamilyModal && (
        <FamilyMembersModal
          caseId={parseInt(id!)}
          onClose={() => setShowFamilyModal(false)}
          onSuccess={loadData}
        />
      )}
      {showWorkModal && (
        <WorkRecordsModal
          caseId={parseInt(id!)}
          onClose={() => setShowWorkModal(false)}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}