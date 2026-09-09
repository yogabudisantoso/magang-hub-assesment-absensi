import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Image as ImageIcon, FileText } from 'lucide-react';
import type { Attendance, InternStats, LogbookReport, PageProps } from '@/types';

interface DashboardProps extends PageProps {
  todayAttendance: Attendance | null;
  stats: InternStats;
  todayReport: (LogbookReport & { photos: { id: number; photo_path: string }[] }) | null;
  recentReports: (LogbookReport & { photos: { id: number; photo_path: string }[] })[];
}

export default function Dashboard({ auth, todayAttendance, stats, todayReport, recentReports }: DashboardProps) {
  return (
    <>
      <Head title="Dashboard" />
      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {auth.user.name}</h1>
            <p className="text-muted-foreground">Intern Dashboard</p>
          </div>
          <div className="flex gap-2">
            {!todayAttendance && (
              <Link href="/intern/attendance/check-in">
                <Button>Check In</Button>
              </Link>
            )}
            {todayAttendance && !todayAttendance.check_out_time && (
              <Link href="/intern/attendance/check-out">
                <Button variant="outline">Check Out</Button>
              </Link>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_days}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.present_days}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Late Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{stats.late_days}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.attendance_rate}%</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Today&apos;s Status</CardTitle>
            </CardHeader>
            <CardContent>
              {todayAttendance ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={todayAttendance.status === 'late' ? 'destructive' : 'default'}>
                      {todayAttendance.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Check In:</span>
                    <span>{todayAttendance.check_in_time}</span>
                  </div>
                  {todayAttendance.check_out_time && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Check Out:</span>
                      <span>{todayAttendance.check_out_time}</span>
                    </div>
                  )}
                  {todayAttendance.daily_log && (
                    <div className="mt-4">
                      <span className="text-muted-foreground">Task Summary:</span>
                      <p className="mt-1 text-sm">{todayAttendance.daily_log.task_summary}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">You haven&apos;t checked in today.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Internship Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Days Passed:</span>
                  <span>{Math.floor(stats.days_passed)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Days:</span>
                  <span>{stats.internship_days}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Remaining:</span>
                  <span>{Math.floor(stats.remaining_days)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Hours:</span>
                  <span>{stats.total_hours}h</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Today&apos;s Logbook</CardTitle>
              {!todayReport && (
                <Link href="/intern/logbook/create">
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Submit
                  </Button>
                </Link>
              )}
            </CardHeader>
            <CardContent>
              {todayReport ? (
                <div className="space-y-3">
                  <p className="text-sm">{todayReport.description}</p>
                  {todayReport.photos.length > 0 && (
                    <div className="flex gap-2">
                      {todayReport.photos.map((photo) => (
                        <img
                          key={photo.id}
                          src={`/storage/${photo.photo_path}`}
                          alt="Report"
                          className="h-16 w-16 rounded object-cover"
                        />
                      ))}
                    </div>
                  )}
                  <Badge variant="secondary">Submitted</Badge>
                </div>
              ) : (
                <p className="text-muted-foreground">No logbook submitted today yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Recent Logbooks</CardTitle>
              <Link href="/intern/logbook">
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentReports.length > 0 ? (
                <div className="space-y-3">
                  {recentReports.map((report) => (
                    <div key={report.id} className="border-b pb-2 last:border-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {new Date(report.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <ImageIcon className="h-3 w-3" />
                          {report.photos.length}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{report.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No logbooks yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

Dashboard.layout = {
  breadcrumbs: [
    {
      title: 'Dashboard',
      href: '/intern/dashboard',
    },
  ],
};
