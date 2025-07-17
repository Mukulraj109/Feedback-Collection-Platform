import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Save, X, GripVertical } from 'lucide-react';
import { Question } from '../../types';

interface FormBuilderProps {
  onSave: (title: string, description: string, questions: Question[]) => void;
  onCancel: () => void;
  initialData?: {
    title: string;
    description: string;
    questions: Question[];
  };
}

const FormBuilder: React.FC<FormBuilderProps> = ({ onSave, onCancel, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [questions, setQuestions] = useState<Question[]>(initialData?.questions || []);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addQuestion = () => {
    const newQuestion: Question = {
      type: 'text',
      question: '',
      required: true,
    };
    setQuestions([...questions, newQuestion]);
    setEditingIndex(questions.length);
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const deleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
    setEditingIndex(null);
  };

  const addOption = (questionIndex: number) => {
    const updated = [...questions];
    const options = updated[questionIndex].options || [];
    updated[questionIndex].options = [...options, ''];
    setQuestions(updated);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updated = [...questions];
    const options = [...(updated[questionIndex].options || [])];
    options[optionIndex] = value;
    updated[questionIndex].options = options;
    setQuestions(updated);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updated = [...questions];
    const options = updated[questionIndex].options || [];
    updated[questionIndex].options = options.filter((_, i) => i !== optionIndex);
    setQuestions(updated);
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a form title');
      return;
    }
    
    if (questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    const validQuestions = questions.filter(q => q.question.trim() !== '');
    if (validQuestions.length === 0) {
      alert('Please ensure all questions have content');
      return;
    }

    onSave(title, description, validQuestions);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="card-3d">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {initialData ? 'Edit Form' : 'Create New Form'}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Build your feedback form with custom questions
            </p>
          </div>
         <div className="flex space-x-3">
  <button onClick={onCancel} className="btn-secondary bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/40">
    <X className="w-4 h-4 mr-2" />
    Cancel
  </button>
  <button onClick={handleSave} className="btn-secondary bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/40">
    <Save className="w-4 h-4 mr-2" />
    Save Form
  </button>
</div>

        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Form Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                placeholder="Enter form title"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field"
                rows={3}
                placeholder="Brief description of your form"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Questions</h3>
              <button onClick={addQuestion} className="btn-primary bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
  <Plus className="w-4 h-4 mr-2" />
  Add Question
</button>

            </div>

            <div className="space-y-6">
              {questions.map((question, index) => (
                <div key={index} className="glass-card border-l-4 border-blue-500">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <GripVertical className="w-5 h-5 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                        Question {index + 1}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                        className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-300"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteQuestion(index)}
                        className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {editingIndex === index ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={question.question}
                        onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                        className="input-field"
                        placeholder="Enter your question"
                      />

                      <div className="flex items-center space-x-6">
                        <select
                          value={question.type}
                          onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                          className="input-field w-auto"
                        >
                          <option value="text">Text Answer</option>
                          <option value="multiple-choice">Multiple Choice</option>
                        </select>

                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={question.required}
                            onChange={(e) => updateQuestion(index, 'required', e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Required</span>
                        </label>
                      </div>

                      {question.type === 'multiple-choice' && (
                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Options:
                          </label>
                          {(question.options || []).map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center space-x-3">
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                                className="input-field"
                                placeholder={`Option ${optionIndex + 1}`}
                              />
                              <button
                                onClick={() => removeOption(index, optionIndex)}
                                className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => addOption(index)}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-300"
                          >
                            + Add Option
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">
                        {question.question || 'Untitled Question'}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="capitalize bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {question.type}
                        </span>
                        {question.required && (
                          <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded">
                            Required
                          </span>
                        )}
                        {question.type === 'multiple-choice' && (
                          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                            {question.options?.length || 0} options
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {questions.length === 0 && (
                <div className="text-center py-12">
                  <div className="animate-float">
                    <Plus className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No questions added yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Click "Add Question" to get started building your form</p>
                  <button onClick={addQuestion} className="btn-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Question
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;