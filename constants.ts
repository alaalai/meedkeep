import { DeviceStatus, Equipment, Ticket, TicketPriority } from "./types";

export const MOCK_EQUIPMENT: Equipment[] = [
  {
    id: 'EQ-1001',
    name: 'MRI Scanner 3.0T',
    type: 'Imaging',
    serialNumber: 'SN-MRI-9982',
    location: 'الرياض - مستشفى الملك فيصل التخصصي',
    department: 'الأشعة',
    status: DeviceStatus.Operational,
    lastMaintenance: '2024-01-15',
    nextMaintenance: '2024-07-15',
    image: 'https://picsum.photos/400/300?random=1'
  },
  {
    id: 'EQ-1002',
    name: 'Ventilator X5',
    type: 'Life Support',
    serialNumber: 'SN-VNT-2231',
    location: 'جدة - مستشفى الملك فهد',
    department: 'العناية المركزة',
    status: DeviceStatus.MaintenanceRequired,
    lastMaintenance: '2023-11-20',
    nextMaintenance: '2024-05-20',
    image: 'https://picsum.photos/400/300?random=2'
  },
  {
    id: 'EQ-1003',
    name: 'CT Scanner Revolution',
    type: 'Imaging',
    serialNumber: 'SN-CT-4451',
    location: 'الدمام - مجمع الدمام الطبي',
    department: 'الطوارئ',
    status: DeviceStatus.UnderRepair,
    lastMaintenance: '2024-02-10',
    nextMaintenance: '2024-08-10',
    image: 'https://picsum.photos/400/300?random=3'
  },
  {
    id: 'EQ-1004',
    name: 'Ultrasound System',
    type: 'Imaging',
    serialNumber: 'SN-US-1122',
    location: 'الرياض - مدينة الملك سعود الطبية',
    department: 'النساء والولادة',
    status: DeviceStatus.Operational,
    lastMaintenance: '2024-03-01',
    nextMaintenance: '2024-09-01',
    image: 'https://picsum.photos/400/300?random=4'
  },
  {
    id: 'EQ-1005',
    name: 'Anesthesia Machine',
    type: 'Surgical',
    serialNumber: 'SN-AN-7788',
    location: 'مكة المكرمة - مستشفى النور',
    department: 'العمليات',
    status: DeviceStatus.OutOfOrder,
    lastMaintenance: '2023-12-05',
    nextMaintenance: '2024-06-05',
    image: 'https://picsum.photos/400/300?random=5'
  }
];

export const MOCK_TICKETS: Ticket[] = [
  {
    id: 'TCK-501',
    equipmentId: 'EQ-1002',
    title: 'انخفاض ضغط الأكسجين',
    description: 'الجهاز يعطي تنبيه انخفاض ضغط متكرر أثناء التشغيل.',
    reportedBy: 'د. أحمد السالم',
    dateCreated: '2024-05-18',
    priority: TicketPriority.High,
    status: 'OPEN',
    aiAnalysis: 'بناءً على الوصف، قد يكون هناك تسريب في صمامات الدخل أو انسداد في الفلاتر الداخلية. يوصى بفحص وحدة المزج.'
  },
  {
    id: 'TCK-502',
    equipmentId: 'EQ-1003',
    title: 'خطأ في معايرة الصورة',
    description: 'ظهور تشويش في الصور المقطعية.',
    reportedBy: 'أخصائي فهد العنزي',
    dateCreated: '2024-05-19',
    priority: TicketPriority.Medium,
    status: 'IN_PROGRESS'
  },
  {
    id: 'TCK-503',
    equipmentId: 'EQ-1005',
    title: 'الجهاز لا يعمل',
    description: 'فشل كامل في التشغيل، لا توجد طاقة.',
    reportedBy: 'د. سارة الشهري',
    dateCreated: '2024-05-20',
    priority: TicketPriority.Critical,
    status: 'OPEN'
  }
];

export const CITIES = [
  "الرياض", "جدة", "الدمام", "مكة المكرمة", "المدينة المنورة", "أبها", "تبوك"
];