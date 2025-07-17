import React, { useState } from 'react';
import { Form } from '../../types';
import { Calendar, Users, Link2, Eye, Edit, Trash2, Share, CheckCircle } from 'lucide-react';

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="card-3d group hover:shadow-2xl">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
              {form.title}
            </h3>
            <div className={`px-2 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
              form.isActive 
                ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 dark:from-green-900/30 dark:to-green-800/30 dark:text-green-300' 
                : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 dark:from-gray-800/30 dark:to-gray-700/30 dark:text-gray-300'
            }`}>
              {form.isActive ? 'Active' : 'Inactive'}
            </div>
          </div>
          {form.description && (
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3 leading-relaxed">
              {form.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4" />
          <span>Created {formatDate(form.createdAt)}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Users className="w-4 h-4" />
          <span className="font-medium">{form.responseCount}</span>
          <span>responses</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => onView(form)}
            className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-300 transform hover:scale-110"
            title="Preview form"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(form)}
            className="p-2 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-300 transform hover:scale-110"
            title="Edit form"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(form._id)}
            className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300 transform hover:scale-110"
            title="Delete form"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex space-x-2">
          <button
  onClick={copyShareLink}
  className={`btn-secondary text-sm py-2 px-3 flex items-center gap-1 ${
    copied ? 'text-green-600 dark:text-green-400' : ''
  }`}
  title="Copy share link"
>
  {copied ? (
    <>
      <CheckCircle className="w-4 h-4" />
      <span>Copied!</span>
    </>
  ) : (
    <>
      <Share className="w-4 h-4" />
      <span>Share</span>
    </>
  )}
</button>

          <button
  onClick={() => onViewResponses(form)}
  className="btn-primary text-sm py-2 px-3 flex items-center gap-1"
  title="View responses"
>
  <Users className="w-4 h-4" />
  <span>Responses</span>
</button>

        </div>
      </div>
    </div>
  );
};

export default FormCard;