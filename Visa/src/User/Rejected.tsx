import { useState, useEffect } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

type VisaApplication = {
  _id: string;
  visaId: string;
  paymentId: string;
  travellers: string;
  email: string;
  phone: string;
  country:string;
  documents: Record<string, any>;
  statusHistory: {
    label: string;
    date: string;
  }[];
  createdAt: string;
  updatedAt: string;
  status: string;
};

const columnHelper = createColumnHelper<VisaApplication>();

const columns = [
  columnHelper.accessor('visaId', {
    header: 'Visa ID',
    cell: info => <span className="font-medium text-gray-900">{info.getValue()}</span>,
  }),
  columnHelper.accessor('travellers', {
    header: 'Travellers',
    cell: info => <span className="text-gray-600">{info.getValue()}</span>,
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: info => <span className="text-gray-600">{info.getValue()}</span>,
  }),
   columnHelper.accessor('country', {
    header: 'Country',
    cell: info => <span className="text-gray-600">{info.getValue()}</span>,
  }),
  columnHelper.accessor('statusHistory', {
    header: 'Status',
    cell: info => {
      const status = info.getValue().find(item => item.label === 'Rejected')?.label || 'Processing';
      return (
        <div className={`px-3 py-1 rounded-full text-sm ${
          status === 'Rejected' 
            ? 'bg-red-100 text-red-800 border border-red-200' 
            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
        }`}>
          {status}
        </div>
      );
    },
  }),
  columnHelper.accessor('createdAt', {
    header: 'Application Date',
    cell: info => <span className="text-gray-600">{new Date(info.getValue()).toLocaleDateString('en-IN')}</span>,
  }),
  columnHelper.accessor('paymentId', {
    header: 'Payment',
    cell: info => (
      <div className="px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800 border border-indigo-200">
        {info.getValue() ? 'Complete' : 'Pending'}
      </div>
    ),
  }),
];

export default function RejectedVisaTable() {
  const [data, setData] = useState<VisaApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [visaIdFilter, setVisaIdFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get phone number from local storage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const phoneNumber = user.phoneNumber;
        
        if (!phoneNumber) {
          throw new Error('Phone number not found in user data');
        }

        const response = await fetch(`http://localhost:5000/api/VisaApplication/rejected/${phoneNumber}`);
        const result = await response.json();
        
        if (result.success) {
          setData(result.data.map((item: any) => ({
            ...item,
            status: item.statusHistory.some((h: any) => h.label === 'Rejected') ? 'Rejected' : 'Processing'
          })));
        } else {
          throw new Error(result.message || 'Failed to fetch data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const filteredData = data
    .filter(item => item.status === 'Rejected')
    .filter(item => item.visaId.toLowerCase().includes(visaIdFilter.toLowerCase()))
    .filter(item => (dateFilter ? new Date(item.createdAt).toISOString().split('T')[0] === dateFilter : true));

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading rejected visa applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-red-800">Error loading data</h3>
          <p className="mt-2 text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Rejected Visa Applications</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Visa ID"
          className="p-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm"
          value={visaIdFilter}
          onChange={e => setVisaIdFilter(e.target.value)}
        />
        <input
          type="date"
          className="p-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredData.map((item) => {
              const status = item.statusHistory.find(h => h.label === 'Rejected')?.label || 'Processing';
              const paymentStatus = item.paymentId ? 'Complete' : 'Pending';
              
              return (
                <tr key={item._id} className="hover:bg-gray-50 transition-colors even:bg-gray-50/30">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{item.visaId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600">{item.travellers}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600">{item.email}</span>
                  </td>
                    <td className="px-6 py-4">
                    <span className="text-gray-600">{item.country}</span>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      status === 'Rejected' 
                        ? 'bg-red-100 text-red-800 border border-red-200' 
                        : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    }`}>
                      {status}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600">{new Date(item.createdAt).toLocaleDateString('en-IN')}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800 border border-indigo-200">
                      {paymentStatus}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            {data.length === 0 ? 'No visa applications found' : 'No rejected applications match your filters'}
          </div>
        )}
      </div>

      {filteredData.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              ← Previous
            </button>
            <span className="text-sm text-gray-700 mx-2">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <button
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next →
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">Show:</span>
            <select
              className="p-2 border rounded-lg bg-white focus:ring-2 focus:ring-red-500 shadow-sm"
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
            >
              {[5, 10, 20].map(pageSize => (
                <option key={pageSize} value={pageSize}>{pageSize}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}