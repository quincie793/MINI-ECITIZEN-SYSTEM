import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { ServiceRequest } from '../types';
import StatusBadge from '../components/StatusBadge';
import { PlusCircle, MapPin, Calendar } from 'lucide-react';

const CitizenDashboard = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // This matches the backend route exactly
        const response = await api.get('/requests/my-requests');
        setRequests(response.data);
      } catch (error) {
        console.error('Failed to fetch requests', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto mt-6 max-w-5xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">My Requests</h2>
          <Link
            to="/submit-request"
            className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white shadow-sm transition hover:bg-blue-700"
          >
            <PlusCircle size={18} /> New Request
          </Link>
        </div>

        {isLoading ? (
          <p className="py-10 text-center text-gray-500">Loading requests...</p>
        ) : requests.length === 0 ? (
          <div className="rounded-lg border border-gray-100 bg-white py-16 text-center shadow-sm">
            <p className="text-lg text-gray-500">
              You haven't submitted any requests yet.
            </p>
            <Link
              to="/submit-request"
              className="mt-2 inline-block text-blue-600 hover:underline"
            >
              Submit your first request
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="flex flex-col justify-between gap-4 rounded-lg border border-gray-100 bg-white p-5 shadow-sm md:flex-row"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-gray-800">
                      {req.category}
                    </h3>
                    <StatusBadge status={req.status} />
                  </div>
                  <p className="text-sm text-gray-600">{req.description}</p>

                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={14} /> {req.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />{' '}
                      {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Image Rendering - Uses the direct Cloudinary URL now */}
                {req.imageUrl && (
                  <div className="h-24 w-full flex-shrink-0 overflow-hidden rounded bg-gray-100 md:w-32">
                    <img
                      src={req.imageUrl}
                      alt="Request Evidence"
                      className="h-full w-full cursor-pointer object-cover transition-transform hover:scale-110"
                      onClick={() => window.open(req.imageUrl!, '_blank')}
                      onError={(e) => {
                        // Fallback if image fails to load
                        (e.target as HTMLImageElement).src =
                          'https://via.placeholder.com/150?text=Image+Not+Found';
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CitizenDashboard;