import { useEffect, useState } from 'react';
import EmptyState from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';
import { getPartRequests, updatePartRequestStatus } from '@/services/requestsService';
import { useToast } from '@/hooks/useToast';
import { getErrorMessage } from '@/lib/utils';
import AdminPageHeader from '@/features/admin/components/AdminPageHeader';

const statusOptions = ['new', 'pending', 'handled', 'closed'];

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const { showToast } = useToast();

  const loadRequests = async () => {
    const data = await getPartRequests();
    setRequests(data);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleStatusChange = async (requestId, status) => {
    try {
      setUpdatingId(requestId);
      await updatePartRequestStatus(requestId, status);
      await loadRequests();
      showToast({ title: 'Request updated', description: 'The request status has been saved.' });
    } catch (error) {
      showToast({ title: 'Update failed', description: getErrorMessage(error), tone: 'error' });
    } finally {
      setUpdatingId(null);
    }
  };

  if (!requests) {
    return <LoadingState label="Loading part requests..." />;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Part requests" description="Review new leads and keep the status clear." />
      {requests.length ? (
        <div className="grid gap-5">
          {requests.map((request) => (
            <div key={request.id} className="card-surface rounded-3xl p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-lg font-bold text-ink-900">{request.part_needed}</h3>
                  <p className="mt-1 text-sm text-ink-600">
                    {request.full_name} • {request.phone} • {request.email || 'No email'}
                  </p>
                </div>
                <select
                  className="input-base h-10 min-w-[150px] py-2"
                  value={request.status || 'new'}
                  onChange={(event) => handleStatusChange(request.id, event.target.value)}
                  disabled={updatingId === request.id}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-4 text-sm text-ink-700">
                Vehicle: {request.vehicle_make} {request.vehicle_model} {request.vehicle_year || ''}
              </p>
              <p className="mt-3 text-sm leading-7 text-ink-600">{request.notes || 'No additional notes provided.'}</p>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No requests yet" description="Customer part requests will appear here after form submissions." />
      )}
    </div>
  );
}
