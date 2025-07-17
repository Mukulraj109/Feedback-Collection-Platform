import React, { useState } from 'react';
import { Form } from '../../types';
import {
  Calendar,
  Users,
  Link2,
  Eye,
  Edit,
  Trash2,
  Share,
  CheckCircle,
} from 'lucide-react';

interface FormCardProps {
  form: Form;
  onView: (form: Form) => void;
  onEdit: (form: Form) => void;
  onDelete: (formId: string) => void;
  onViewResponses: (form: Form) => void;
}

const FormCard: React.FC<FormCardProps> = ({
  form,
  onView,
  onEdit,
  onDelete,
  onViewResponses,
}) => {
  const [copied, setCopied] = useState(false);

  const copyShareLink = async () => {
    const shareUrl = `${window.location.origin}/form/${form._id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <div className="card-3d group hover:shadow-2xl transition-all duration-300 rounded-2xl p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
      {/* Title and Status */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {form.title}
            </h3>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full transition-all duration-300 ${
                form.isActive
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700/40 dark:text-gray-300'
              }`}
            >
              {form.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          {form.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 leading-relaxed">
              {form.description}
            </p>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>Created {formatDate(form.createdAt)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span className="font-medium">{form.responseCount}</span>
          <span>responses</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3 justify-between items-center">
        {/* Actions */}
        <div className="w-full flex justify-end gap-2 sm:justify-start sm:w-auto mb-4 sm:mb-0">

          <button
            onClick={() => onView(form)}
            className="p-2 rounded-lg text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all transform hover:scale-110"
            title="Preview form"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(form)}
            className="p-2 rounded-lg text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all transform hover:scale-110"
            title="Edit form"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(form._id)}
            className="p-2 rounded-lg text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all transform hover:scale-110"
            title="Delete form"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Share & Responses */}
     
<div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:items-center sm:justify-end">
  <button
    onClick={copyShareLink}
    className={`btn-secondary text-sm py-2 px-3 flex items-center justify-center gap-1 w-full sm:w-auto ${
      copied ? 'text-green-600 dark:text-green-400' : ''
    }`}
    title="Copy share link"
  >
    {copied ? (
      <>
        <CheckCircle className="w-4 h-4" />
        Copied!
      </>
    ) : (
      <>
        <Share className="w-4 h-4" />
        Share
      </>
    )}
  </button>

  <button
    onClick={() => onViewResponses(form)}
    className="btn-primary text-sm py-2 px-3 flex items-center justify-center gap-1 w-full sm:w-auto"
    title="View responses"
  >
    <Users className="w-4 h-4" />
    Responses
  </button>
</div>

      </div>
    </div>
  );
};

export default FormCard;
