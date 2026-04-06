// Legacy: client/src/components/DataBox/GSMData.js
"use client";

import { useAnalysisStore } from "@/stores/analysisStore";

function Cell({ children }: { children: React.ReactNode }) {
  const text = String(children ?? "");
  return (
    <td>
      <div className="single-line" title={text}>
        {text}
      </div>
    </td>
  );
}

export default function GSMData() {
  const { dataList, dataLoaded } = useAnalysisStore();

  if (!dataLoaded) {
    return (
      <p className="text-muted">
        Choose an Analysis Type on the left panel and click on the Load button to see a list of GSM displayed here.
      </p>
    );
  }

  return (
    <div>
      <div className="table-responsive">
        <table className="table table-sm table-striped table-borderless gsm-table">
          <thead>
            <tr>
              <th style={{ width: "18%" }}>GSM</th>
              <th style={{ width: "30%" }}>Title</th>
              <th style={{ width: "30%" }}>Description</th>
              <th style={{ width: "15%" }}>Group</th>
              <th style={{ width: "15%" }}>Batch</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((sample, i) => (
              <tr key={sample.gsm || i}>
                <Cell>{sample.gsm}</Cell>
                <Cell>{sample.title}</Cell>
                <Cell>{sample.description as string}</Cell>
                <Cell>{sample.groups}</Cell>
                <Cell>{sample.batch}</Cell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
