export default function ErrorFallback({ error, resetErrorBoundary }: any) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.
  console.log(error, resetErrorBoundary);

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.toString()}</pre>
    </div>
  );
}
