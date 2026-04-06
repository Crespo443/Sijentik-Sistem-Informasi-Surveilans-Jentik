function PageLoader() {
  return (
    <div
      className="flex min-h-[40vh] items-center justify-center p-6"
      role="status"
      aria-live="polite"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-600" />
      <span className="sr-only">Loading page...</span>
    </div>
  );
}

export default PageLoader;
