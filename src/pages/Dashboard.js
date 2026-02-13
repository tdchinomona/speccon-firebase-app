import React, { useState, useEffect, useCallback } from 'react';
import { getCashSummary, getAvailableDates } from '../services/firebaseService';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { format } from 'date-fns';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('2026-02-06');
  const [error, setError] = useState(null);

  const loadAvailableDates = useCallback(async () => {
    try {
      const dates = await getAvailableDates();
      setAvailableDates(dates);
      if (dates.length > 0) {
        setSelectedDate(prevDate => prevDate || dates[0]);
      }
    } catch (error) {
      console.error('Error loading dates:', error);
    }
  }, []);

  const loadData = useCallback(async (date) => {
    if (!date) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getCashSummary(date);
      setSummary(data);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data. Make sure Firebase is configured.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAvailableDates();
  }, [loadAvailableDates]);

  useEffect(() => {
    if (selectedDate) {
      loadData(selectedDate);
    }
  }, [selectedDate, loadData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-speccon-blue border-t-transparent"></div>
          <div className="mt-6 text-xl font-semibold text-gray-700">Loading financial data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 shadow-md">
        <h3 className="text-red-800 font-bold text-lg mb-2">Error Loading Data</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const totalBank = summary.reduce((sum, co) => sum + (Number(co.bankTotal) || 0), 0);
  const totalAssets = summary.reduce((sum, co) => sum + (Number(co.assetsTotal) || 0), 0);
  const totalLiabilities = summary.reduce((sum, co) => sum + (Number(co.liabilitiesTotal) || 0), 0);
  const netPosition = totalBank + totalAssets - totalLiabilities;
  const totalAssetsAndBank = totalBank + totalAssets;

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate percentages
  const bankPercentage = totalAssetsAndBank > 0 ? ((totalBank / totalAssetsAndBank) * 100).toFixed(1) : 0;
  const assetsPercentage = totalAssetsAndBank > 0 ? ((totalAssets / totalAssetsAndBank) * 100).toFixed(1) : 0;
  const netPositionPercentage = totalAssetsAndBank > 0 ? ((netPosition / totalAssetsAndBank) * 100).toFixed(1) : 0;

  const chartData = summary.map(co => ({
    name: co.companyName,
    Bank: Number(co.bankTotal) || 0,
    Assets: Number(co.assetsTotal) || 0,
    Liabilities: Number(co.liabilitiesTotal) || 0,
    Net: (Number(co.bankTotal) || 0) + (Number(co.assetsTotal) || 0) - (Number(co.liabilitiesTotal) || 0)
  }));

  // Pie chart data for composition
  const pieData = [
    { name: 'Bank', value: totalBank, color: '#2563eb' },
    { name: 'Assets', value: totalAssets, color: '#10b981' },
  ];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-semibold">{formatCurrency(entry.value)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm mb-8">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Cash Position Dashboard</h1>
              <p className="text-gray-600 text-sm">
                {selectedDate && format(new Date(selectedDate), 'EEEE, MMMM dd, yyyy')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Report Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={availableDates.length > 0 ? availableDates[availableDates.length - 1] : undefined}
                max={availableDates.length > 0 ? availableDates[0] : undefined}
                className="px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-speccon-blue focus:border-speccon-blue outline-none transition-all font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-8">
        {summary.length === 0 ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-6 shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-yellow-700 font-medium">
                  No data available for {selectedDate}. Please add financial data to Firestore.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Bank Card */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-blue-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-blue-500 rounded-xl p-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-blue-700 bg-blue-200 px-3 py-1 rounded-full">
                      {bankPercentage}%
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-blue-700 uppercase tracking-wide mb-1">Total Bank</div>
                  <div className="text-3xl font-bold text-blue-900">{formatCurrency(totalBank)}</div>
                </div>
              </div>

              {/* Current Assets Card */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-green-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-green-500 rounded-xl p-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-green-700 bg-green-200 px-3 py-1 rounded-full">
                      {assetsPercentage}%
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-1">Current Assets</div>
                  <div className="text-3xl font-bold text-green-900">{formatCurrency(totalAssets)}</div>
                </div>
              </div>

              {/* Liabilities Card */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-red-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-red-500 rounded-xl p-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-red-700 bg-red-200 px-3 py-1 rounded-full">
                      {totalAssetsAndBank > 0 ? ((totalLiabilities / totalAssetsAndBank) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-red-700 uppercase tracking-wide mb-1">Liabilities</div>
                  <div className="text-3xl font-bold text-red-900">{formatCurrency(totalLiabilities)}</div>
                </div>
              </div>

              {/* Net Position Card */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-purple-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-purple-500 rounded-xl p-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      netPosition >= 0 
                        ? 'text-purple-700 bg-purple-200' 
                        : 'text-red-700 bg-red-200'
                    }`}>
                      {netPositionPercentage}%
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-purple-700 uppercase tracking-wide mb-1">Net Position</div>
                  <div className={`text-3xl font-bold ${
                    netPosition >= 0 ? 'text-purple-900' : 'text-red-900'
                  }`}>
                    {formatCurrency(netPosition)}
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Company Breakdown Bar Chart */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Company Breakdown</h2>
                  <div className="flex gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-blue-500"></div>
                      <span className="text-gray-600">Bank</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-green-500"></div>
                      <span className="text-gray-600">Assets</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-red-500"></div>
                      <span className="text-gray-600">Liabilities</span>
                    </div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorBank" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#1e40af" stopOpacity={0.8}/>
                      </linearGradient>
                      <linearGradient id="colorAssets" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#059669" stopOpacity={0.8}/>
                      </linearGradient>
                      <linearGradient id="colorLiabilities" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#dc2626" stopOpacity={0.8}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      stroke="#9ca3af"
                    />
                    <YAxis 
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      stroke="#9ca3af"
                      tickFormatter={(value) => `R${(value / 1000000).toFixed(1)}M`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      wrapperStyle={{ paddingTop: '20px' }}
                      iconType="square"
                    />
                    <Bar dataKey="Bank" fill="url(#colorBank)" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="Assets" fill="url(#colorAssets)" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="Liabilities" fill="url(#colorLiabilities)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Composition Pie Chart */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Cash Composition</h2>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Company Details Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-xl font-bold text-gray-900">Company Details</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Company</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Bank</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Assets</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Liabilities</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Net Position</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">% of Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {summary.map((company, index) => {
                      const companyNet = (Number(company.bankTotal) || 0) + (Number(company.assetsTotal) || 0) - (Number(company.liabilitiesTotal) || 0);
                      const companyTotal = (Number(company.bankTotal) || 0) + (Number(company.assetsTotal) || 0);
                      const percentage = totalAssetsAndBank > 0 ? ((companyTotal / totalAssetsAndBank) * 100).toFixed(1) : 0;
                      return (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-semibold text-gray-900">{company.companyName}</div>
                            <div className="text-sm text-gray-500">{company.companyCode}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-blue-700">
                            {formatCurrency(Number(company.bankTotal) || 0)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-green-700">
                            {formatCurrency(Number(company.assetsTotal) || 0)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-red-700">
                            {formatCurrency(Number(company.liabilitiesTotal) || 0)}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-right font-bold ${
                            companyNet >= 0 ? 'text-purple-700' : 'text-red-700'
                          }`}>
                            {formatCurrency(companyNet)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                              {percentage}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-gray-50 font-bold">
                    <tr>
                      <td className="px-6 py-4 text-gray-900">Total</td>
                      <td className="px-6 py-4 text-right text-blue-900">{formatCurrency(totalBank)}</td>
                      <td className="px-6 py-4 text-right text-green-900">{formatCurrency(totalAssets)}</td>
                      <td className="px-6 py-4 text-right text-red-900">{formatCurrency(totalLiabilities)}</td>
                      <td className={`px-6 py-4 text-right ${
                        netPosition >= 0 ? 'text-purple-900' : 'text-red-900'
                      }`}>
                        {formatCurrency(netPosition)}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-900">100%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
