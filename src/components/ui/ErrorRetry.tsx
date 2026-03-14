'use client';

interface ErrorRetryProps {
  message?: string;
  onRetry: () => void;
}

export default function ErrorRetry({ message = 'Something went wrong. Please check your connection.', onRetry }: ErrorRetryProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <p className="text-sp-light-gray mb-4 text-center">{message}</p>
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-sp-green text-black rounded-full font-semibold text-sm hover:bg-sp-green-light transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
