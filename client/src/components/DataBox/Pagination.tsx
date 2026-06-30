interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  // Build page items with ellipsis (first/last always visible)
  const pageItems: (number | null)[] = [];
  const windowSize = 5;
  if (totalPages <= windowSize + 2) {
    for (let i = 1; i <= totalPages; i++) pageItems.push(i);
  } else {
    const halfWin = Math.floor(windowSize / 2);
    let start = Math.max(2, currentPage - halfWin);
    let end = Math.min(totalPages - 1, currentPage + halfWin);
    if (start <= 2) end = Math.min(totalPages - 1, windowSize + 1);
    if (end >= totalPages - 1) start = Math.max(2, totalPages - windowSize);
    pageItems.push(1);
    if (start > 2) pageItems.push(null);
    for (let i = start; i <= end; i++) pageItems.push(i);
    if (end < totalPages - 1) pageItems.push(null);
    pageItems.push(totalPages);
  }

  return (
    <nav>
      <ul className="pagination pagination-sm mb-0">
        <li className={`page-item ${currentPage <= 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onPageChange(Math.max(1, currentPage - 1))}>&lsaquo;</button>
        </li>
        {pageItems.map((item, idx) =>
          item === null ? (
            <li key={`ellipsis-${idx}`} className="page-item disabled">
              <span className="page-link">&hellip;</span>
            </li>
          ) : (
            <li key={item} className={`page-item ${item === currentPage ? "active" : ""}`}>
              <button className="page-link" onClick={() => onPageChange(item)}>{item}</button>
            </li>
          )
        )}
        <li className={`page-item ${currentPage >= totalPages ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}>&rsaquo;</button>
        </li>
      </ul>
    </nav>
  );
}
