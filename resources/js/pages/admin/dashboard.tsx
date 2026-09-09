import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import type { DashboardStats, Attendance, LogbookReport, PageProps } from '@/types';

interface AdminDashboardProps extends PageProps {
  stats: DashboardStats;
  todayReports: (LogbookReport & {
    user: { id: number; name: string; email: string };
    photos: { id: number; photo_path: string }[];
  })[];
}

export default function AdminDashboard({ auth, stats, todayReports }: AdminDashboardProps) {
  return (
    <>
      <Head title="Admin Dashboard" />
      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of all interns</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Interns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_interns}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.present_today}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Late Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{stats.late_today}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.absent_today}</div>
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
              <CardTitle>Recent Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.recent_activity.length > 0 ? (
                <div className="space-y-3">
                  {stats.recent_activity.map((activity: Attendance) => (
                    <div key={activity.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                      <div>
                        <p className="font-medium">{activity.user?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Check in: {activity.check_in_time}
                          {activity.check_out_time && ` | Check out: ${activity.check_out_time}`}
                        </p>
                      </div>
                      <Badge variant={activity.status === 'late' ? 'destructive' : 'default'}>
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No attendance today.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Today&apos;s Logbooks</CardTitle>
              <Link href="/admin/logbook">
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {todayReports.length > 0 ? (
                <div className="space-y-3">
                  {todayReports.map((report) => (
                    <div key={report.id} className="border-b pb-2 last:border-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{report.user.name}</p>
                        <span className="text-xs text-muted-foreground">
                          {report.photos.length} photo(s)
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{report.description}</p>
                      {report.photos.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {report.photos.slice(0, 3).map((photo) => (
                            <img
                              key={photo.id}
                              src={`/storage/${photo.photo_path}`}
                              alt=""
                              className="h-10 w-10 rounded object-cover"
                            />
                          ))}
                          {report.photos.length > 3 && (
                            <span className="text-xs text-muted-foreground self-center ml-1">
                              +{report.photos.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No logbooks submitted today.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

AdminDashboard.layout = {
  breadcrumbs: [
    {
      title: 'Dashboard',
      href: '/admin/dashboard',
    },
  ],
};
