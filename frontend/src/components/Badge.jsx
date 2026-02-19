import React from "react";

const colorMap = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-rose-100 text-rose-800",
  SHIPPED: "bg-blue-100 text-blue-800",
  DELIVERED: "bg-emerald-100 text-emerald-800",
  DEFAULT: "bg-slate-100 text-slate-800"
};

const Badge = ({ value }) => {
  const color = colorMap[value] || colorMap.DEFAULT;
  return <span className={`px-2 py-1 text-xs rounded ${color}`}>{value}</span>;
};

export default Badge;
