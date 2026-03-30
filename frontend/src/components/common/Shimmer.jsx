import React from 'react';

const ShimmerBase = ({ className }) => (
  <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
    <div className="absolute inset-0 shimmer -translate-x-full" />
  </div>
);

// Stat Card Shimmer
export const StatCardShimmer = () => (
  <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
    <div className="flex justify-between items-start">
      <div className="flex-1 space-y-4">
        <ShimmerBase className="h-4 w-1/2 rounded-lg" />
        <ShimmerBase className="h-10 w-3/4 rounded-xl" />
        <ShimmerBase className="h-5 w-1/3 rounded-lg" />
      </div>
      <ShimmerBase className="w-16 h-16 rounded-2xl" />
    </div>
  </div>
);

// Dashboard Stats Grid Shimmer
export const DashboardStatsShimmer = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
    {[1, 2, 3, 4].map((item) => (
      <StatCardShimmer key={item} />
    ))}
  </div>
);

// Table Row Shimmer
export const TableRowShimmer = ({ columns = 6 }) => (
  <>
    {[1, 2, 3, 4, 5].map((row) => (
      <tr key={row} className="border-b border-slate-50">
        {[...Array(columns)].map((_, col) => (
          <td key={col} className="px-6 py-4">
            <ShimmerBase className={`h-6 rounded-lg ${col === 0 ? 'w-3/5' : 'w-4/5'}`} />
          </td>
        ))}
      </tr>
    ))}
  </>
);

// Card Shimmer
export const CardShimmer = ({ count = 3 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
    {[...Array(count)].map((_, idx) => (
      <div key={idx} className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
        <div className="flex gap-4 mb-6">
          <ShimmerBase className="w-12 h-12 rounded-2xl" />
          <div className="flex-1 space-y-2 pt-1">
            <ShimmerBase className="h-5 w-full rounded-lg" />
            <ShimmerBase className="h-4 w-4/5 rounded-lg" />
          </div>
        </div>
        <div className="space-y-2">
          <ShimmerBase className="h-3 w-full rounded-lg" />
          <ShimmerBase className="h-3 w-11/12 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

// Product Card Shimmer
export const ProductCardShimmer = ({ count = 4 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
    {[...Array(count)].map((_, idx) => (
      <div key={idx} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
        <div className="aspect-[4/5] p-6">
          <ShimmerBase className="w-full h-full rounded-3xl" />
        </div>
        <div className="p-8 flex flex-col items-center text-center space-y-4">
          <ShimmerBase className="h-7 w-4/5 rounded-xl" />
          <ShimmerBase className="h-5 w-1/2 rounded-lg" />
          <div className="flex gap-3 w-full justify-center">
            <ShimmerBase className="h-8 w-24 rounded-xl" />
            <ShimmerBase className="h-8 w-16 rounded-xl" />
          </div>
          <ShimmerBase className="h-12 w-full rounded-2xl mt-4" />
        </div>
      </div>
    ))}
  </div>
);

// List Item Shimmer
export const ListItemShimmer = ({ count = 3 }) => (
  <div className="space-y-1">
    {[...Array(count)].map((_, idx) => (
      <div key={idx} className="flex justify-between items-center p-6 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
        <div className="flex-1 space-y-2">
          <ShimmerBase className="h-5 w-1/3 rounded-lg" />
          <ShimmerBase className="h-4 w-1/4 rounded-lg opacity-60" />
        </div>
        <div className="flex gap-4 items-center">
          <ShimmerBase className="h-5 w-20 rounded-lg" />
          <ShimmerBase className="h-10 w-28 rounded-xl" />
        </div>
      </div>
    ))}
  </div>
);

// Full Page Shimmer
export const PageShimmer = ({ type = 'dashboard' }) => {
  if (type === 'dashboard') {
    return (
      <div className="space-y-10 animate-in fade-in duration-700">
        <div className="space-y-3">
          <ShimmerBase className="h-12 w-64 rounded-2xl" />
          <ShimmerBase className="h-6 w-96 rounded-xl opacity-60" />
        </div>
        <DashboardStatsShimmer />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
            <div className="p-8 border-b border-slate-50">
              <ShimmerBase className="h-7 w-48 rounded-xl" />
            </div>
            <ListItemShimmer count={4} />
          </div>
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm space-y-8">
            <ShimmerBase className="h-7 w-32 rounded-xl" />
            {[1, 2, 3].map((item) => (
              <div key={item} className="space-y-3">
                <div className="flex justify-between items-end">
                  <ShimmerBase className="h-4 w-32 rounded-lg opacity-60" />
                  <ShimmerBase className="h-4 w-12 rounded-lg opacity-40" />
                </div>
                <ShimmerBase className="h-2.5 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="space-y-10 animate-in fade-in duration-700">
        <div className="space-y-3">
          <ShimmerBase className="h-12 w-64 rounded-2xl" />
          <ShimmerBase className="h-6 w-96 rounded-xl opacity-60" />
        </div>
        <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
          <div className="p-8 border-b border-slate-50 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <th key={i} className="px-6 pb-6 text-left">
                      <ShimmerBase className="h-4 w-20 rounded-lg opacity-60" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <TableRowShimmer />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// Address Card Shimmer
export const AddressCardShimmer = ({ count = 3 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
    {[...Array(count)].map((_, idx) => (
      <div key={idx} className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <ShimmerBase className="h-7 w-1/2 rounded-xl" />
          <ShimmerBase className="w-6 h-6 rounded-lg opacity-40" />
        </div>
        <ShimmerBase className="h-5 w-2/3 rounded-lg mb-4 opacity-60" />
        <div className="space-y-2">
          <ShimmerBase className="h-4 w-full rounded-lg opacity-40" />
          <ShimmerBase className="h-4 w-3/4 rounded-lg opacity-40" />
        </div>
      </div>
    ))}
  </div>
);

// Profile Shimmer
export const ProfileShimmer = () => (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
        <div className="flex justify-between items-center bg-white/50 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white shadow-sm">
            <div className="space-y-3">
                <ShimmerBase className="h-10 w-48 rounded-2xl" />
                <ShimmerBase className="h-6 w-72 rounded-xl opacity-60" />
            </div>
            <ShimmerBase className="w-32 h-14 rounded-2xl" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
                <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 flex flex-col items-center text-center shadow-sm">
                    <ShimmerBase className="w-32 h-32 rounded-[2.5rem] mb-6 border-4 border-slate-50" />
                    <ShimmerBase className="h-7 w-32 rounded-xl mb-3" />
                    <ShimmerBase className="h-4 w-24 rounded-lg opacity-60" />
                </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm space-y-10">
                <ShimmerBase className="h-8 w-48 rounded-xl" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="space-y-3">
                            <ShimmerBase className="h-4 w-24 rounded-lg opacity-40" />
                            <ShimmerBase className="h-12 w-full rounded-2xl" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export default PageShimmer;
