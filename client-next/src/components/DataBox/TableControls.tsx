import Pagination from "./Pagination";

const DEFAULT_PAGE_SIZES = [15, 25, 50, 100, 200];

interface TableControlsProps {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  startRow: number;
  endRow: number;
  onPageChange: (page: number) => void;
  pageSizes?: number[];
}

export default function TableControls({
  pageSize,
  onPageSizeChange,
  currentPage,
  totalPages,
  totalCount,
  startRow,
  endRow,
  onPageChange,
  pageSizes = DEFAULT_PAGE_SIZES,
}: TableControlsProps) {
  return (
    <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap gap-2" style={{ fontSize: "0.8rem" }}>
      <div className="d-flex align-items-center gap-1">
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="form-select form-select-sm"
          style={{ width: "auto" }}
          aria-label="Rows per page"
        >
          {pageSizes.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <span className="text-muted" style={{ whiteSpace: "nowrap" }}>rows per page</span>
      </div>
      <div className="d-flex align-items-center gap-3">
        <span className="text-muted" style={{ whiteSpace: "nowrap" }}>
          {totalCount > 0 ? `Showing ${startRow}-${endRow} of ${totalCount} records` : "No records"}
        </span>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      </div>
    </div>
  );
}
