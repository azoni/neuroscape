"use client";

interface Column {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, any>[];
  onRowClick?: (row: Record<string, any>) => void;
}

const ALIGN_CLASS: Record<string, string> = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
};

export function DataTable({ columns, data, onRowClick }: DataTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-dark-800/50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-xs font-medium uppercase tracking-wider text-dim ${
                  ALIGN_CLASS[col.align ?? "left"]
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((row, i) => (
            <tr
              key={i}
              onClick={() => onRowClick?.(row)}
              className={`bg-surface transition-colors duration-150 ${
                onRowClick
                  ? "cursor-pointer hover:bg-dark-700/50"
                  : ""
              }`}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-4 py-3 text-gray-200 ${
                    ALIGN_CLASS[col.align ?? "left"]
                  }`}
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-dim"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
