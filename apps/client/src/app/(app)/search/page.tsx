import { Suspense } from 'react';
import SearchResults from '../../../components/SearchResults'; // We will create this component next
import { Loader2 } from 'lucide-react';

// A simple loading fallback component
const SearchLoading = () => (
  <div className="flex flex-col items-center justify-center pt-20">
    <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
    <p className="mt-4 text-gray-600">Searching for courses...</p>
  </div>
);

export default function SearchPage() {
  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <Suspense fallback={<SearchLoading />}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
