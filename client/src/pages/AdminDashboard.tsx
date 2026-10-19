import { useEffect, useState } from 'react';
import api from '../services/api';
import type { ServiceRequest } from '../types';
import StatusBadge from '../components/StatusBadge';
import { AlertCircle, Clock, CheckCircle, List, Search } from 'lucide-react';

interface Analytics {
  pending: number;
  inProgress: number;
  resolved: number;
  total: number;
}

const AdminDashboard = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    pending: 0,
    inProgress: 0,
    resolved: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
      const [requestsRes, analyticsRes] = await Promise.all([
        api.get('/admin/requests'),
        api.get('/admin/analytics'),
      ]);
      setRequests(requestsRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error('Failed to fetch admin data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await api.patch(`/admin/requests/${id}/status`, { status: newStatus });
      fetchData();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  // --- bonus feature: Search and Filter ---
  const filteredRequests = requests.filter((req) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      req.category.toLowerCase().includes(searchLower) ||
      req.location.toLowerCase().includes(searchLower) ||
      req.description.toLowerCase().includes(searchLower) ||
      req.user?.name.toLowerCase().includes(searchLower) ||
      req.user?.email.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <main className="mx-auto mt-4 max-w-7xl p-6">
        {/* Analytics Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <div className="rounded-full bg-blue-100 p-3 text-blue-600">
              <List size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Requests
              </p>
              <p className="text-2xl font-bold text-gray-800">
                {analytics.total}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <div className="rounded-full bg-yellow-100 p-3 text-yellow-600">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-800">
                {analytics.pending}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <div className="rounded-full bg-blue-100 p-3 text-blue-600">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-gray-800">
                {analytics.inProgress}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
            <div className="rounded-full bg-green-100 p-3 text-green-600">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Resolved</p>
              <p className="text-2xl font-bold text-gray-800">
                {analytics.resolved}
              </p>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
          {/* Table Header & Search Bar */}
          <div className="flex flex-col items-center justify-between gap-4 border-b border-gray-100 px-6 py-4 md:flex-row">
            <h2 className="text-lg font-bold text-gray-800">
              All Service Requests
            </h2>

            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by user, category, or location..."
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <p className="py-10 text-center text-gray-500">Loading data...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-sm text-gray-600">
                    <th className="p-4 font-semibold">User</th>
                    <th className="p-4 font-semibold">Issue Details</th>
                    <th className="p-4 font-semibold">Image</th>
                    <th className="p-4 font-semibold">Location</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req) => (
                    <tr
                      key={req.id}
                      className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                    >
                      <td className="p-4">
                        <p className="font-medium text-gray-800">
                          {req.user?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {req.user?.email}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-gray-800">
                          {req.category}
                        </p>
                        <p className="max-w-xs truncate text-sm text-gray-500">
                          {req.description}
                        </p>
                      </td>
                      <td className="p-4">
                        {req.imageUrl ? (
                          <a
                            href={`http://localhost:5000${req.imageUrl}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              src={`http://localhost:5000${req.imageUrl}`}
                              alt="Evidence"
                              className="h-12 w-16 cursor-pointer rounded border object-cover shadow-sm transition-transform hover:scale-150"
                            />
                          </a>
                        ) : (
                          <span className="text-xs italic text-gray-400">
                            No Image
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {req.location}
                      </td>
                      <td className="p-4">
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="p-4">
                        <select
                          className="cursor-pointer rounded border border-gray-300 bg-white p-1 text-sm focus:ring-blue-500"
                          value={req.status}
                          onChange={(e) =>
                            handleStatusChange(req.id, e.target.value)
                          }
                        >
                          <option value="PENDING">Pending</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="RESOLVED">Resolved</option>
                        </select>
                      </td>
                    </tr>
                  ))}

                  {filteredRequests.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center">
                        <p className="text-lg text-gray-500">
                          No requests found matching "{searchTerm}"
                        </p>
                        <button
                          onClick={() => setSearchTerm('')}
                          className="mt-2 text-sm text-blue-600 hover:underline"
                        >
                          Clear search
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
