import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import type { User, PageProps } from '@/types';

interface InternsProps extends PageProps {
  interns: (User & { attendances_count: number })[];
}

export default function InternsIndex({ interns }: InternsProps) {
  return (
    <>
      <Head title="Manage Interns" />
      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Interns</h1>
            <p className="text-muted-foreground">Manage intern accounts</p>
          </div>
          <Link href="/admin/interns/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Intern
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {interns.map((intern) => (
            <Card key={intern.id}>
              <CardHeader>
                <CardTitle>{intern.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">{intern.email}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {intern.attendances_count} days attended
                  </Badge>
                </div>
                {intern.start_date && intern.end_date && (
                  <p className="text-xs text-muted-foreground">
                    {new Date(intern.start_date).toLocaleDateString()} - {new Date(intern.end_date).toLocaleDateString()}
                  </p>
                )}
                <div className="flex gap-2 pt-2">
                  <Link href={`/admin/interns/${intern.id}/edit`}>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}

InternsIndex.layout = {
  breadcrumbs: [
    { title: 'Interns', href: '/admin/interns' },
  ],
};
