import React, { useState, useEffect } from 'react';
import { Form } from '../../types';
import { api } from '../../utils/api';
import FormCard from '../Forms/FormCard';
import FormBuilder from '../Forms/FormBuilder';
import ResponsesView from '../Responses/ResponsesView';
import { Plus, FileText, Users, TrendingUp, Activity, Search } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [editingForm, setEditingForm] = useState<Form | null>(null);
  const [viewingResponses, setViewingResponses] = useState<Form | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      const data = await api.getForms();
      setForms(data);
    } catch (error) {
      console.error('Failed to load forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateForm = async (title: string, description: string, questions: any[]) => {
    try {
      await api.createForm({ title, description, questions, isActive: true });
      setShowFormBuilder(false);
      loadForms();
    } catch (error) {
      console.error('Failed to create form:', error);
    }
  };

  const handleEditForm = async (title: string, description: string, questions: any[]) => {
    if (!editingForm) return;
    try {
      await api.updateForm(editingForm._id, { title, description, questions });
      setEditingForm(null);
      loadForms();
    } catch (error) {
      console.error('Failed to update form:', error);
    }
  };

  const handleDeleteForm = async (formId: string) => {
    if (!confirm('Are you sure you want to delete this form?')) return;
    try {
      await api.deleteForm(formId);
      loadForms();
    } catch (error) {
      console.error('Failed to delete form:', error);
    }
  };

  const filteredForms = forms.filter(form =>
    form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (form.description && form.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const stats = {
    totalForms: forms.length,
    activeForms: forms.filter(f => f.isActive).length,
    totalResponses: forms.reduce((sum, form) => sum + form.responseCount, 0),
    avgResponsesPerForm: forms.length > 0 ? Math.round(forms.reduce((sum, form) => sum + form.responseCount, 0) / forms.length) : 0,
  };

  if (showFormBuilder) return <FormBuilder onSave={handleCreateForm} onCancel={() => setShowFormBuilder(false)} />;
  if (editingForm) return <FormBuilder onSave={handleEditForm} onCancel={() => setEditingForm(null)} initialData={{ title: editingForm.title, description: editingForm.description || '', questions: editingForm.questions }} />;
  if (viewingResponses) return <ResponsesView form={viewingResponses} onBack={() => setViewingResponses(null)} />;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Manage your feedback forms and analyze responses</p>
        </div>
        <button onClick={() => setShowFormBuilder(true)} className="btn-primary animate-float">
          <Plus className="w-5 h-5 mr-2" />
          Create New Form
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Forms', value: stats.totalForms, icon: <FileText className="w-6 h-6 text-white" />, color: 'from-blue-500 to-blue-600' },
          { label: 'Active Forms', value: stats.activeForms, icon: <TrendingUp className="w-6 h-6 text-white" />, color: 'from-green-500 to-green-600' },
          { label: 'Total Responses', value: stats.totalResponses, icon: <Users className="w-6 h-6 text-white" />, color: 'from-purple-500 to-purple-600' },
          { label: 'Avg per Form', value: stats.avgResponsesPerForm, icon: <Activity className="w-6 h-6 text-white" />, color: 'from-orange-500 to-orange-600' },
        ].map((stat, idx) => (
          <div key={idx} className="card-3d group">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search forms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredForms.length} of {forms.length} forms
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Forms</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card">
                <div className="skeleton h-6 mb-3"></div>
                <div className="skeleton h-4 mb-2"></div>
                <div className="skeleton h-4 w-2/3 mb-4"></div>
                <div className="flex justify-between">
                  <div className="skeleton h-8 w-20"></div>
                  <div className="skeleton h-8 w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredForms.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-20 h-20 text-gray-400 dark:text-gray-500 mx-auto mb-6 animate-float" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {forms.length === 0 ? 'No forms yet' : 'No matching forms'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {forms.length === 0 
                ? 'Create your first feedback form to start collecting valuable insights from your customers'
                : 'Try adjusting your search terms to find the forms you\'re looking for'}
            </p>
            {forms.length === 0 && (
              <button onClick={() => setShowFormBuilder(true)} className="btn-primary">
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Form
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredForms.map(form => (
              <FormCard
                key={form._id}
                form={form}
                onView={(form) => window.open(`/form/${form._id}`, '_blank')}
                onEdit={setEditingForm}
                onDelete={handleDeleteForm}
                onViewResponses={setViewingResponses}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
