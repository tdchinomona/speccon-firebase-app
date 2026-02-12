import React, { useState, useEffect, useCallback } from 'react';
import { getCashSummary, getAvailableDates } from '../services/firebaseService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
      if (dates.length > 0 && !selectedDate) {
        setSelectedDate(dates[0]);
      }
    } catch (error) {
      console.error('Error loading dates:', error);
    }
  }, [selectedDate]);

  const loadData = useCallback(async () => {
    if (!selectedDate) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getCashSummary(selectedDate);
      setSummary(data);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data. Make sure Firebase is configured.');
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadAvailableDates();
  }, [loadAvailableDates]);

  useEffect(() => {
    if (selectedDate) {
      loadData();
    }
  }, [selectedDate, loadData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-speccon-blue"></div>
          <div className="mt-4 text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold mb-2">Error</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const totalBank = summary.reduce((sum, co) => sum + (co.bankTotal || 0), 0);
  const totalAssets = summary.reduce((sum, co) => sum + (co.assetsTotal || 0), 0);
  const totalLiabilities = summary.reduce((sum, co) => sum + (co.liabilitiesTotal || 0), 0);
  const netPosition = totalBank + totalAssets - totalLiabilities;

  const chartData = summary.map(co => ({
    name: co.companyName,
    Bank: co.bankTotal || 0,
    Assets: co.assetsTotal || 0,
    Liabilities: co.liabilitiesTotal || 0
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Cash Position Dashboard</h1>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={availableDates.length > 0 ? availableDates[availableDates.length - 1] : undefined}
          max={availableDates.length > 0 ? availableDates[0] : undefined}
          className="px-4 py-2 border rounded-lg"
        />
      </div>

      {summary.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-600">No data for {selectedDate}. Run setup script to add data.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
              <div className="text-sm text-gray-600 uppercase font-semibold">Total Bank</div>
              <div className="text-3xl font-bold text-blue-600 mt-2">
                R {totalBank.toLocaleString()}
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
              <div className="text-sm text-gray-600 uppercase font-semibold">Current Assets</div>
              <div className="text-3xl font-bold text-green-600 mt-2">
                R {totalAssets.toLocaleString()}
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500">
              <div className="text-sm text-gray-600 uppercase font-semibold">Liabilities</div>
              <div className="text-3xl font-bold text-red-600 mt-2">
                R {totalLiabilities.toLocaleString()}
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
              <div className="text-sm text-gray-600 uppercase font-semibold">Net Position</div>
              <div className="text-3xl font-bold text-purple-600 mt-2">
                R {netPosition.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Company Breakdown</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `R ${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="Bank" fill="#3b82f6" />
                <Bar dataKey="Assets" fill="#10b981" />
                <Bar dataKey="Liabilities" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
