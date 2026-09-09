import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import type { LeaveRequest, PageProps } from '@/types';

interface LeaveRequestsProps extends PageProps {
  pendingRequests: LeaveRequest[];
}

export default function LeaveRequestsIndex({ pendingRequests }: LeaveRequestsProps) {
  const handleApprove = (id: number) => {
    router.post(`/admin/leave-requests/${id}/approve`);
  };

  const handleReject = (id: number) => {
    router.post(`/admin/leave-requests/${id}/reject`);
  };

  return (
    <>
      <Head title="Leave Requests" />
      <div className="flex h-full flex-1 flex-col gap-6 p-6">
        <div>
          <h1 className="text-2xl font-bold">Leave Requests</h1>
          <p className="text-muted-foreground">Review and approve intern leave requests</p>
        </div>

        <div className="grid gap-4">
          {pendingRequests.length > 0 ? (
            pendingRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{request.user?.name}</h3>
                      <p className="text-sm text-muted-foreground">{request.user?.email}</p>
                      <div className="flex items-center gap-2 pt-2">
                        <Badge variant="secondary">
                          {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                        </Badge>
                      </div>
                      <p className="pt-2">{request.reason}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 hover:text-green-700"
                        onClick={() => handleApprove(request.id)}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleReject(request.id)}
                      >
                        <X className="mr-1 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No pending leave requests.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}

LeaveRequestsIndex.layout = {
  breadcrumbs: [
    { title: 'Leave Requests', href: '/admin/leave-requests' },
  ],
};
