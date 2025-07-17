import React, { useState, useEffect } from 'react';
import { Form, FormResponse } from '../../types';
import { api } from '../../utils/api';
import { ArrowLeft, Download, Calendar, User, TrendingUp, Eye, Filter } from 'lucide-react';

interface ResponsesViewProps {
  form: Form;
  onBack: () => void;
}

const ResponsesView: React.FC<ResponsesViewProps> = ({ form, onBack }) => {
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    loadResponses();
  }, [form._id]);

  const loadResponses = async () => {
    try {
      const data = await api.getFormResponses(form._id);
      setResponses(data);
    } catch (error) {
      console.error('Failed to load responses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await api.exportResponses(form._id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${form.title}-responses.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export responses:', error);
    } finally {
      setExporting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Unknown time';
      }
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours}h ago`;
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays}d ago`;
      return formatDate(dateString);
    } catch (error) {
      return 'Unknown time';
    }
  };

  const filteredAndSortedResponses = responses
    .filter(response => {
      if (!searchTerm) return true;
      return Object.values(response.responses).some(answer => 
        answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.submittedAt || a.createdAt).getTime();
      const dateB = new Date(b.submittedAt || b.createdAt).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const getResponseStats = () => {
    if (responses.length === 0) return { today: 0, thisWeek: 0, thisMonth: 0 };
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      today: responses.filter(r => new Date(r.submittedAt || r.createdAt) >= today).length,
      thisWeek: responses.filter(r => new Date(r.submittedAt || r.createdAt) >= thisWeek).length,
      thisMonth: responses.filter(r => new Date(r.submittedAt || r.createdAt) >= thisMonth).length,
    };
  };

  const stats = getResponseStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{form.title}</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Response Analytics & Data</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExport}
            disabled={exporting || responses.length === 0}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4 mr-2" />
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Responses</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{responses.length}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.today}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Week</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stats.thisWeek}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card-3d">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Latest Response</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                {responses.length > 0 
                  ? getRelativeTime(responses[0].submittedAt || responses[0].createdAt)
                  : 'No responses'
                }
              </p>
            </div>
            <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl">
              <Eye className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search responses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-64"
              />
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              className="input-field w-auto"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredAndSortedResponses.length} of {responses.length} responses
          </p>
        </div>
      </div>

      {/* Responses Table */}
      <div className="card-3d overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Response Data</h2>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex space-x-4">
                <div className="skeleton h-4 w-32"></div>
                <div className="skeleton h-4 flex-1"></div>
                <div className="skeleton h-4 w-24"></div>
              </div>
            ))}
          </div>
        ) : filteredAndSortedResponses.length === 0 ? (
          <div className="text-center py-16">
            <div className="animate-float">
              <User className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {responses.length === 0 ? 'No responses yet' : 'No matching responses'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              {responses.length === 0 
                ? 'Share your form link to start collecting valuable feedback from your audience'
                : 'Try adjusting your search terms or filters to find what you\'re looking for'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="modern-table">
              <thead>
                <tr>
                  <th className="sticky left-0 bg-gray-50 dark:bg-gray-700 z-10">Submitted</th>
                  {form.questions.map((question, index) => (
                    <th key={question._id || index} className="min-w-[200px]">
                      {question.question}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedResponses.map((response, index) => (
                  <tr key={response._id} className="group">
                    <td className="sticky left-0 bg-white dark:bg-gray-800 group-hover:bg-gray-50 dark:group-hover:bg-gray-700/50 z-10 font-medium">
                      <div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {formatDate(response.submittedAt || response.createdAt)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {getRelativeTime(response.submittedAt || response.createdAt)}
                        </div>
                      </div>
                    </td>
                    {form.questions.map((question, qIndex) => (
                      <td key={question._id || qIndex} className="max-w-xs">
                        <div className="truncate" title={response.responses[question._id!] || '-'}>
                          {response.responses[question._id!] || (
                            <span className="text-gray-400 dark:text-gray-500 italic">No answer</span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponsesView;