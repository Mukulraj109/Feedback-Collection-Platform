import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Form } from '../../types';
import { api } from '../../utils/api';
import { CheckCircle, AlertCircle, Send, FileText } from 'lucide-react';

const PublicForm: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (formId) {
      loadForm();
    }
  }, [formId]);

  const loadForm = async () => {
    try {
      const formData = await api.getPublicForm(formId!);
      setForm(formData);
    } catch (error) {
      setError('Form not found or no longer available');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form) return;

    // Validate required fields
    const missingRequired = form.questions
      .filter(q => q.required)
      .find(q => !responses[q._id!]?.trim());

    if (missingRequired) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.submitResponse(form._id, responses);
      setSubmitted(true);
    } catch (error) {
      setError('Failed to submit response. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!formId) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="glass-card text-center max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Loading Form</h2>
          <p className="text-gray-600 dark:text-gray-300">Please wait while we prepare your form...</p>
        </div>
      </div>
    );
  }

  if (error && !form) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="card-3d max-w-md text-center">
          <div className="animate-float">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Form Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            The form you're looking for might have been removed or is no longer active.
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="card-3d max-w-md text-center">
          <div className="animate-float">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Thank You!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Your response has been submitted successfully. We appreciate your feedback!
          </p>
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Your input helps us improve and provide better services.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="card-3d">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <FileText className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{form?.title}</h1>
            {form?.description && (
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
                {form.description}
              </p>
            )}
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Please take a moment to share your thoughts with us
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {form?.questions.map((question, index) => (
              <div key={question._id || index} className="space-y-3">
                <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200">
                  <span className="flex items-center space-x-2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <span>{question.question}</span>
                    {question.required && <span className="text-red-500">*</span>}
                  </span>
                </label>

                {question.type === 'text' ? (
                  <textarea
                    value={responses[question._id!] || ''}
                    onChange={(e) => handleInputChange(question._id!, e.target.value)}
                    className="input-field min-h-[120px] resize-y"
                    placeholder="Share your thoughts here..."
                    required={question.required}
                  />
                ) : (
                  <div className="space-y-3">
                    {question.options?.map((option, optionIndex) => (
                      <label key={optionIndex} className="flex items-center p-3 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-all duration-300 group">
                        <input
                          type="radio"
                          name={question._id}
                          value={option}
                          checked={responses[question._id!] === option}
                          onChange={(e) => handleInputChange(question._id!, e.target.value)}
                          className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500"
                          required={question.required}
                        />
                        <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-700 dark:text-red-300 font-medium">{error}</span>
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Send className="w-5 h-5" />
                    <span>Submit Response</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PublicForm;