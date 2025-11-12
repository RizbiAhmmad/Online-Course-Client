export default function FailPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      <h1 className="text-3xl font-bold text-green-700">Payment Failed!</h1>
      <p className="mt-2 text-gray-600">Please try again.</p>
    </div>
  );
}
