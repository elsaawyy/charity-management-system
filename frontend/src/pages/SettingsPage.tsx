import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Database, Globe, Bell, Shield, FileText } from 'lucide-react';
import caseService from '@/services/caseService';

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();

  const { data, refetch } = useQuery({
    queryKey: ['settings'],
    queryFn: () => caseService.getSettings(),
  });

  useEffect(() => {
    if (data?.data) {
      setSettings(data.data);
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      caseService.updateSetting(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  const backupMutation = useMutation({
    mutationFn: () => caseService.backupDatabase(),
    onSuccess: () => {
      alert('تم إنشاء نسخة احتياطية بنجاح');
    },
    onError: () => {
      alert('حدث خطأ في إنشاء النسخة الاحتياطية');
    },
  });

  const handleSettingChange = (category: string, key: string, value: string) => {
    setSettings((prev: any) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const [category, categorySettings] of Object.entries(settings)) {
        if (category !== 'general' && category !== 'notifications' && category !== 'security' && category !== 'audit') continue;
        for (const [key, value] of Object.entries(categorySettings as Record<string, string>)) {
          await updateMutation.mutateAsync({ key, value });
        }
      }
      alert('تم حفظ الإعدادات بنجاح');
    } catch (error) {
      alert('حدث خطأ في حفظ الإعدادات');
    } finally {
      setSaving(false);
    }
  };

  const handleBackup = () => {
    if (confirm('هل أنت متأكد من إنشاء نسخة احتياطية من قاعدة البيانات؟')) {
      backupMutation.mutate();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">الإعدادات</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-light"
        >
          <Save size={18} />
          {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
        </button>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4 border-b pb-2">
            <Globe size={24} className="text-primary" />
            <h2 className="text-xl font-bold">الإعدادات العامة</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">اسم النظام</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                value={settings.general?.site_name || ''}
                onChange={(e) => handleSettingChange('general', 'site_name', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">وصف النظام</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
                value={settings.general?.site_description || ''}
                onChange={(e) => handleSettingChange('general', 'site_description', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">البريد الإلكتروني للتواصل</label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded-lg"
                value={settings.general?.contact_email || ''}
                onChange={(e) => handleSettingChange('general', 'contact_email', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">العناصر في الصفحة</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg"
                value={settings.general?.items_per_page || '10'}
                onChange={(e) => handleSettingChange('general', 'items_per_page', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Audit Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4 border-b pb-2">
            <FileText size={24} className="text-primary" />
            <h2 className="text-xl font-bold">إعدادات التدقيق</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">فترة الاحتفاظ بالسجلات (أيام)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-lg"
                value={settings.audit?.audit_retention_days || '90'}
                onChange={(e) => handleSettingChange('audit', 'audit_retention_days', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Backup Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4 border-b pb-2">
            <Database size={24} className="text-primary" />
            <h2 className="text-xl font-bold">النسخ الاحتياطي</h2>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">إنشاء نسخة احتياطية من قاعدة البيانات</p>
            <button
              onClick={handleBackup}
              disabled={backupMutation.isPending}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Database size={18} className="inline ml-2" />
              {backupMutation.isPending ? 'جاري الإنشاء...' : 'إنشاء نسخة احتياطية'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}