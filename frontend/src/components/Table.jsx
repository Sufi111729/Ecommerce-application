import React from "react";

const Table = ({ headers, rows }) => {
  return (
    <div className="overflow-x-auto border border-ink/10 rounded-lg bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-sand text-ink/70">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 text-left font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className="border-t border-ink/5">
              {row.map((cell, i) => (
                <td key={i} className="px-4 py-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
