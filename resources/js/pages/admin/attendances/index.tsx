import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Download } from 'lucide-react';
import type { Attendance, User, PageProps } from '@/types';

interface AttendancesProps extends PageProps {
  report: Attendance[];
  filters: {
    start_date: string;
    end_date: string;
    user_id?: number;
    status?: string;
  };
}

export default function AttendancesIndex({ report, filters }: AttendancesProps) {
  const [startDate, setStartDate] = useState(filters.start_date);
  const [endDate, setEndDate] = useState(filters.end_date);
  const [status, setStatus] = useState(filters.status || '');

  const handleFilter = () => {
    router.get('/admin/attendances', {
      start_date: startDate,
      end_date: endDate,
      status: status || undefined,
    }, { preserveState: true });
  };

  const handleExport = () => {
    window.location.href = `/admin/attendances/export?start_date=${startDate}&end_date=${endDate}&status=${status || ''}`;
  };

  return (
    <>
      <Head title="Attendance Report" />
      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Attendance Report</h1>
            <p className="text-muted-foreground">View and export attendance data</p>
          </div>
          <Button onClick={handleExport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="present">Present</option>
                  <option value="late">Late</option>
                  <option value="absent">Absent</option>
                  <option value="on_leave">On Leave</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleFilter}>Apply Filter</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Results ({report.length} records)</CardTitle>
          </CardHeader>
          <CardContent>
            {report.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left">Date</th>
                      <th className="p-2 text-left">Name</th>
                      <th className="p-2 text-left">Check In</th>
                      <th className="p-2 text-left">Check Out</th>
                      <th className="p-2 text-left">Status</th>
                      <th className="p-2 text-left">Hours</th>
                      <th className="p-2 text-left">Task</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.map((row) => (
                      <tr key={row.id} className="border-b">
                        <td className="p-2">{new Date(row.date).toLocaleDateString()}</td>
                        <td className="p-2">{row.user?.name}</td>
                        <td className="p-2">{row.check_in_time}</td>
                        <td className="p-2">{row.check_out_time || '-'}</td>
                        <td className="p-2">
                          <Badge variant={row.status === 'late' ? 'destructive' : 'default'}>
                            {row.status}
                          </Badge>
                        </td>
                        <td className="p-2">{row.work_hours ? `${row.work_hours}h` : '-'}</td>
                        <td className="p-2 max-w-[200px] truncate">{row.daily_log?.task_summary || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No records found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

AttendancesIndex.layout = {
  breadcrumbs: [
    { title: 'Attendance', href: '/admin/attendances' },
  ],
};
