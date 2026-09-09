import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Download, ImageIcon, Search } from 'lucide-react';
import type { LogbookReport, PageProps } from '@/types';

interface LogbookIndexProps extends PageProps {
  reports: (LogbookReport & { 
    user: { id: number; name: string; email: string };
    photos: { id: number; photo_path: string }[] 
  })[];
  filters: {
    start_date: string | null;
    end_date: string | null;
  };
}

export default function LogbookIndex({ reports, filters }: LogbookIndexProps) {
  const [startDate, setStartDate] = useState(filters.start_date || '');
  const [endDate, setEndDate] = useState(filters.end_date || '');

  const handleFilter = () => {
    const params: Record<string, string> = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    router.get('/admin/logbook', params, { preserveState: true });
  };

  return (
    <>
      <Head title="Logbook" />
      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Logbook</h1>
            <p className="text-muted-foreground">View all intern logbook entries</p>
          </div>
          <Button variant="outline" onClick={() => {
            const params = new URLSearchParams();
            if (startDate) params.set('start_date', startDate);
            if (endDate) params.set('end_date', endDate);
            window.location.href = `/admin/logbook/export?${params.toString()}`;
          }}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Start Date</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">End Date</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <Button onClick={handleFilter}>
                <Search className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {reports.length > 0 ? (
            reports.map((report) => (
              <Card key={report.id}>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{report.user.name}</p>
                        <p className="text-sm text-muted-foreground">{report.user.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {new Date(report.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <ImageIcon className="h-4 w-4" />
                          {report.photos.length}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm">{report.description}</p>
                    {report.photos.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto">
                        {report.photos.map((photo) => (
                          <img
                            key={photo.id}
                            src={`/storage/${photo.photo_path}`}
                            alt="Logbook photo"
                            className="h-32 w-32 rounded-md object-cover"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No logbook entries found.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}

LogbookIndex.layout = {
  breadcrumbs: [
    { title: 'Logbook', href: '/admin/logbook' },
  ],
};
