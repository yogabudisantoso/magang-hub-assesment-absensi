import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import type { LeaveRequest, PageProps } from '@/types';

interface LeaveIndexProps extends PageProps {
  leaveRequests: LeaveRequest[];
}

export default function LeaveIndex({ leaveRequests }: LeaveIndexProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <>
      <Head title="My Leave Requests" />
      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Leave Requests</h1>
            <p className="text-muted-foreground">View and submit leave requests</p>
          </div>
          <Link href="/intern/leave/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {leaveRequests.length > 0 ? (
            leaveRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusVariant(request.status)}>
                          {request.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <span className="text-sm text-muted-foreground">
                          {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="pt-2">{request.reason}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No leave requests yet. Click "New Request" to submit one.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}

LeaveIndex.layout = {
  breadcrumbs: [
    { title: 'Leave Requests', href: '/intern/leave' },
  ],
};
