// Legacy: client/src/components/Analysis/Analysis.js (routed via /:code)
export default async function AnalysisWithCode({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return (
    <div>
      <h1>Analysis — {code}</h1>
    </div>
  );
}
