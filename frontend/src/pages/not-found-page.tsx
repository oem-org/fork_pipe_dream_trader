import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-screen custom-bg-color">
      <div className="text-center px-6 py-12 max-w-lg bg-white shadow-md rounded-lg">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-lg text-gray-600 mb-6">
          Oops! The page you are looking for doesn’t exist.
        </p>
        <Link
          to="/"
          className="btn-primary px-6 py-3 inline-block text-white font-semibold rounded-lg shadow-md bg-blue-600 hover:bg-blue-700"
        >
          Go back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
