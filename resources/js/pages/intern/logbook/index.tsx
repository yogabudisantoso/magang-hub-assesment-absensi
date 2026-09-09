import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Image as ImageIcon } from 'lucide-react';
import type { LogbookReport, PageProps } from '@/types';

interface LogbookIndexProps extends PageProps {
  reports: (LogbookReport & { photos: { id: number; photo_path: string }[] })[];
}

export default function LogbookIndex({ reports }: LogbookIndexProps) {
  return (
    <>
      <Head title="Logbook" />
      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Logbook</h1>
            <p className="text-muted-foreground">Your work logbook with photo evidence</p>
          </div>
          <Link href="/intern/logbook/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Entry
            </Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {reports.length > 0 ? (
            reports.map((report) => (
              <Card key={report.id}>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
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
                        {report.photos.length} photos
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
                            className="h-24 w-24 rounded-md object-cover"
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
                No logbook entries yet. Click &quot;New Entry&quot; to submit one.
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
    { title: 'Logbook', href: '/intern/logbook' },
  ],
};
