import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const SubmitRequest = () => {
  const [category, setCategory] = useState('Broken Streetlight');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('category', category);
      formData.append('location', location);
      formData.append('description', description);
      if (image) {
        formData.append('image', image);
      }

      // Send to backend
      // FIX: Removed the manual headers. Axios handles FormData headers automatically!
      await api.post('/requests', formData);

      // On success, go back to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-2xl rounded-lg bg-white p-6 shadow-md">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">
        Submit a New Request
      </h1>

      {error && (
        <div className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            className="mt-1 w-full rounded border p-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Broken Streetlight</option>
            <option>Water Issue</option>
            <option>Garbage Collection</option>
            <option>Road Maintenance</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Main Street, Nairobi"
            className="mt-1 w-full rounded border p-2"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            required
            placeholder="Describe the issue in detail..."
            className="mt-1 h-32 w-full rounded border p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Image (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            className="mt-1 w-full rounded border p-2"
            onChange={(e) =>
              setImage(e.target.files ? e.target.files[0] : null)
            }
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
};

export default SubmitRequest;