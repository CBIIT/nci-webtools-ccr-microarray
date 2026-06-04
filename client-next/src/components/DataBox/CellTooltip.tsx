"use client";

import { useState, useCallback } from "react";
import { createPortal } from "react-dom";

interface CellTooltipProps {
  content: string;
  tdStyle?: React.CSSProperties;
  children: React.ReactNode;
}

export default function CellTooltip({ content, tdStyle, children }: CellTooltipProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const show = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setPos({ x: rect.left, y: rect.bottom });
  }, []);

  const hide = useCallback(() => setPos(null), []);

  return (
    <td style={tdStyle}>
      <div
        className="single-line"
        onMouseEnter={show}
        onMouseLeave={hide}
      >
        {children}
      </div>
      {pos && content && createPortal(
        <div className="cell-tooltip-popup" style={{ left: pos.x, top: pos.y + 6 }}>
          <div className="cell-tooltip-arrow" />
          {content}
        </div>,
        document.body
      )}
    </td>
  );
}
