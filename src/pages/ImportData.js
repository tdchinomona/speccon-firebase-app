import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import { batchAddCashPositions } from '../services/firebaseService';

const ImportData = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [stats, setStats] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const validateRow = (row, index) => {
    const rowErrors = [];
    const rowNum = index + 2; // +2 because index is 0-based and we skip header

    // Check required fields
    if (!row.reportDate || !row.reportDate.trim()) {
      rowErrors.push(`Row ${rowNum}: Missing reportDate`);
    } else {
      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(row.reportDate.trim())) {
        rowErrors.push(`Row ${rowNum}: Invalid date format. Use YYYY-MM-DD (e.g., 2026-02-13)`);
      }
    }

    // Validate companyId format (allow any value, no existence check)
    if (!row.companyId || !row.companyId.trim()) {
      rowErrors.push(`Row ${rowNum}: Missing companyId`);
    }
    // Note: Custom company IDs are allowed - they don't need to exist in Firestore

    // Validate accountTypeId format (allow any value, no existence check)
    if (!row.accountTypeId || !row.accountTypeId.trim()) {
      rowErrors.push(`Row ${rowNum}: Missing accountTypeId`);
    }
    // Note: Custom account type IDs are allowed - they don't need to exist in Firestore

    // Validate subAccountId if provided (optional field, allow any value)
    // No existence check - custom sub-account IDs are allowed

    if (!row.amount || row.amount.trim() === '') {
      rowErrors.push(`Row ${rowNum}: Missing amount`);
    } else {
      const amount = parseFloat(row.amount.toString().replace(/,/g, ''));
      if (isNaN(amount)) {
        rowErrors.push(`Row ${rowNum}: Invalid amount "${row.amount}". Must be a number.`);
      } else if (amount < 0) {
        rowErrors.push(`Row ${rowNum}: Amount cannot be negative`);
      }
    }

    return rowErrors;
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      setErrors(['Please select a CSV file']);
      return;
    }

    setFile(selectedFile);
    setErrors([]);
    setSuccess(false);
    setPreview(null);
    setStats(null);

    // Parse CSV for preview
    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setErrors(results.errors.map(e => `CSV Parse Error: ${e.message}`));
          return;
        }

        // Validate all rows
        const allErrors = [];
        const validRows = [];

        results.data.forEach((row, index) => {
          const rowErrors = validateRow(row, index);
          if (rowErrors.length > 0) {
            allErrors.push(...rowErrors);
          } else {
            const validRow = {
              reportDate: row.reportDate.trim(),
              companyId: row.companyId.trim().toLowerCase(),
              accountTypeId: row.accountTypeId.trim().toLowerCase(),
              amount: parseFloat(row.amount.toString().replace(/,/g, ''))
            };
            // Add subAccountId if provided
            if (row.subAccountId && row.subAccountId.trim()) {
              validRow.subAccountId = row.subAccountId.trim().toLowerCase();
            }
            validRows.push(validRow);
          }
        });

        setErrors(allErrors);
        setPreview(validRows.slice(0, 10)); // Show first 10 rows
        setStats({
          total: results.data.length,
          valid: validRows.length,
          invalid: allErrors.length
        });
      },
      error: (error) => {
        setErrors([`Error reading CSV file: ${error.message}`]);
      }
    });
  };

  const handleImport = async () => {
    if (!file || errors.length > 0) {
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const validRows = [];
          const allErrors = [];

          results.data.forEach((row, index) => {
            const rowErrors = validateRow(row, index);
            if (rowErrors.length === 0) {
              validRows.push({
                reportDate: row.reportDate.trim(),
                companyId: row.companyId.trim().toLowerCase(),
                accountTypeId: row.accountTypeId.trim().toLowerCase(),
                amount: parseFloat(row.amount.toString().replace(/,/g, ''))
              });
            } else {
              allErrors.push(...rowErrors);
            }
          });

          if (allErrors.length > 0) {
            setErrors(allErrors);
            setLoading(false);
            return;
          }

          if (validRows.length === 0) {
            setErrors(['No valid rows to import']);
            setLoading(false);
            return;
          }

          // Import to Firestore
          const results_import = await batchAddCashPositions(validRows);
          const successCount = results_import.filter(r => r.success).length;
          const failCount = results_import.filter(r => !r.success).length;

          if (failCount > 0) {
            setErrors([`Imported ${successCount} records. ${failCount} failed.`]);
          } else {
            setSuccess(true);
            setErrors([]);
            setStats({
              total: validRows.length,
              valid: successCount,
              invalid: failCount
            });
          }

          setLoading(false);
        },
        error: (error) => {
          setErrors([`Error processing CSV: ${error.message}`]);
          setLoading(false);
        }
      });
    } catch (error) {
      setErrors([`Import failed: ${error.message}`]);
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const template = `reportDate,companyId,accountTypeId,subAccountId,amount
2026-02-13,speccon,bank-account,,1500000
2026-02-13,speccon,current-assets,accounts-receivable,500000
2026-02-13,speccon,current-assets,client-loans,250000
2026-02-13,speccon,current-liabilities,,300000
2026-02-13,megro,bank-account,,1200000
2026-02-13,megro,current-assets,accounts-receivable,400000
2026-02-13,megro,current-assets,client-loans,200000
2026-02-13,megro,current-liabilities,,250000`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cash-positions-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Show loading while checking auth
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Import Cash Positions</h1>
                <p className="text-gray-600">Upload a CSV file to import financial data</p>
              </div>
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">CSV Format Requirements</h2>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• <strong>Required Columns:</strong> reportDate, companyId, accountTypeId, amount</li>
              <li>• <strong>Optional Column:</strong> subAccountId (for detailed breakdown)</li>
              <li>• <strong>Date format:</strong> YYYY-MM-DD (e.g., 2026-02-13)</li>
              <li>• <strong>Amount:</strong> Numbers only, no commas or currency symbols (e.g., 1500000 for R1,500,000)</li>
              <li>• <strong>Company IDs:</strong> Any value allowed (custom companies accepted)</li>
              <li>• <strong>Account Type IDs:</strong> Any value allowed (custom account types accepted)</li>
              <li>• <strong>Sub-Account IDs:</strong> Any value allowed (optional, custom sub-accounts accepted)</li>
            </ul>
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                <strong>Note:</strong> Custom company/account type IDs are accepted. If they don't exist in Firestore, 
                they will appear as "Unknown" on the dashboard. You can create them in Firestore later for proper display.
              </p>
            </div>
            <button
              onClick={downloadTemplate}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              📥 Download CSV Template
            </button>
          </div>

          {/* File Upload */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Upload CSV File</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-speccon-blue transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="space-y-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-speccon-blue text-white rounded-lg hover:bg-speccon-blue-light transition-colors font-medium"
                  >
                    Choose CSV File
                  </button>
                  <p className="mt-2 text-sm text-gray-500">
                    {file ? file.name : 'No file selected'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          {preview && preview.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Preview (First 10 Rows)</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Company</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Account Type</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Sub-Account</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {preview.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{row.reportDate}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{row.companyId}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{row.accountTypeId}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{row.subAccountId || '-'}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                          R {row.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Stats */}
          {stats && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Validation Results</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                  <div className="text-sm text-gray-600">Total Rows</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">{stats.valid}</div>
                  <div className="text-sm text-green-600">Valid</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-700">{stats.invalid}</div>
                  <div className="text-sm text-red-600">Errors</div>
                </div>
              </div>
            </div>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-red-800 mb-3">Validation Errors</h3>
              <div className="max-h-64 overflow-y-auto">
                <ul className="space-y-1 text-sm text-red-700">
                  {errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6 mb-6">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <h3 className="text-lg font-semibold text-green-800">
                  Import Successful! {stats?.valid} records imported.
                </h3>
              </div>
              <button
                onClick={() => navigate('/')}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                View Dashboard
              </button>
            </div>
          )}

          {/* Import Button */}
          {file && errors.length === 0 && !success && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <button
                onClick={handleImport}
                disabled={loading}
                className="w-full px-6 py-4 bg-speccon-blue text-white rounded-lg hover:bg-speccon-blue-light transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Importing...
                  </span>
                ) : (
                  'Import Data'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportData;
