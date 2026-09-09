export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'intern';
  start_date: string | null;
  end_date: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Attendance {
  id: number;
  user_id: number;
  date: string;
  check_in_time: string;
  check_out_time: string | null;
  status: 'present' | 'late' | 'absent' | 'on_leave';
  latitude: number | null;
  longitude: number | null;
  photo_path: string | null;
  user?: User;
  daily_log?: DailyLog;
  work_hours?: number;
  created_at: string;
}

export interface DailyLog {
  id: number;
  attendance_id: number;
  task_summary: string;
  created_at: string;
}

export interface LeaveRequest {
  id: number;
  user_id: number;
  start_date: string;
  end_date: string;
  reason: string;
  attachment_path: string | null;
  status: 'pending' | 'approved' | 'rejected';
  user?: User;
  created_at: string;
}

export interface DashboardStats {
  total_interns: number;
  present_today: number;
  late_today: number;
  absent_today: number;
  on_leave_today: number;
  attendance_rate: number;
  recent_activity: Attendance[];
}

export interface InternStats {
  total_days: number;
  present_days: number;
  late_days: number;
  total_hours: number;
  attendance_rate: number;
  internship_days: number;
  days_passed: number;
  remaining_days: number;
}

export interface LogbookReport {
  id: number;
  user_id: number;
  date: string;
  description: string;
  user?: User;
  photos?: LogbookReportPhoto[];
  created_at: string;
}

export interface LogbookReportPhoto {
  id: number;
  logbook_report_id: number;
  photo_path: string;
}

export interface PageProps {
  auth: {
    user: User;
  };
  flash?: {
    success?: string;
    error?: string;
  };
}
