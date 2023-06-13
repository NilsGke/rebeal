"use client";

const ErrorPage = ({ error, reset }: { error: Error; reset: () => void }) => {
  return (
    <div>
      <h1 className="text-2xl">Error</h1>
      <h2>{error.name}</h2>
      <p>{error.message}</p>
      <button onClick={reset}>try again</button>
    </div>
  );
};

export default ErrorPage;
