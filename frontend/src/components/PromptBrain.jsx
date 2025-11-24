/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { FiEdit2, FiMail, FiUpload, FiPlay, FiCheck, FiTrash2 } from 'react-icons/fi';

const PromptBrain = () => {
  const [activeTab, setActiveTab] = useState('prompts');
  const [prompts, setPrompts] = useState({
    categorization: 'Analyze this email and categorize it into one of: To-Do, Meeting, Follow-up, Request, Information, Other. Provide reasoning.',
    actionItems: 'Extract specific action items, deadlines, and responsibilities from this email. Format as bullet points.',
    autoReply: 'Draft a professional auto-reply acknowledging receipt and indicating when to expect a proper response.'
  });
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [tempPrompt, setTempPrompt] = useState('');
  const [emails, setEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  const mockEmails = [
    {
      id: 1,
      sender: 'project.manager@company.com',
      subject: 'Q4 Project Timeline Review',
      timestamp: '2024-01-15 14:30',
      body: 'Hi team, we need to review the Q4 project timeline. Please provide your updates by EOD Wednesday.',
      category: '',
      actionItems: [],
      processed: false
    },
    {
      id: 2,
      sender: 'client.relations@partner.org',
      subject: 'Meeting Follow-up: Contract Discussion',
      timestamp: '2024-01-15 11:15',
      body: 'Following our meeting, here are the key action items we discussed...',
      category: '',
      actionItems: [],
      processed: false
    },
    {
      id: 3,
      sender: 'hr@company.com',
      subject: 'Benefits Enrollment Reminder',
      timestamp: '2024-01-14 16:45',
      body: 'Reminder: Benefits enrollment closes this Friday. Please complete your selections.',
      category: '',
      actionItems: [],
      processed: false
    }
  ];

  const startEditingPrompt = (promptType) => {
    setEditingPrompt(promptType);
    setTempPrompt(prompts[promptType]);
  };

  const savePrompt = () => {
    if (tempPrompt.trim() && editingPrompt) {
      setPrompts(prev => ({ ...prev, [editingPrompt]: tempPrompt }));
    }
    setEditingPrompt(null);
    setTempPrompt('');
  };

  const cancelEditing = () => {
    setEditingPrompt(null);
    setTempPrompt('');
  };

  const loadMockEmails = () => {
    setIsLoading(true);
    setTimeout(() => {
      setEmails(mockEmails);
      setIsLoading(false);
    }, 1000);
  };

  const processEmails = async () => {
    setIsLoading(true);
    setProcessingProgress(0);
    
    // Simulate processing pipeline
    for (let i = 0; i < emails.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setProcessingProgress(((i + 1) / emails.length) * 100);
      
      // Simulate AI processing
      setEmails(prev => prev.map((email, index) => 
        index === i ? {
          ...email,
          category: ['To-Do', 'Meeting', 'Follow-up'][Math.floor(Math.random() * 3)],
          actionItems: ['Review document', 'Schedule meeting', 'Provide feedback'].slice(0, Math.random() * 3 + 1),
          processed: true
        } : email
      ));
    }
    
    setIsLoading(false);
  };

  const clearEmails = () => {
    setEmails([]);
    setProcessingProgress(0);
  };

  const promptConfigs = [
    {
      key: 'categorization',
      label: 'Categorization Prompt',
      description: 'Defines how emails are categorized for organization'
    },
    {
      key: 'actionItems',
      label: 'Action Item Prompt',
      description: 'Extracts tasks, deadlines, and responsibilities'
    },
    {
      key: 'autoReply',
      label: 'Auto-Reply Draft Prompt',
      description: 'Generates automatic responses based on email content'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Email Intelligence Hub</h1>
        <p className="text-gray-600 mt-2">Ingest, categorize, and automate email processing with AI</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">AI Prompt Configurations</h2>
              <p className="text-gray-600 text-sm mt-1">Define how AI processes your emails</p>
            </div>
            
            <div className="p-4 space-y-4">
              {promptConfigs.map((config) => (
                <div key={config.key} className="border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  <div className="p-3 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">{config.label}</h3>
                        <p className="text-xs text-gray-600 mt-1">{config.description}</p>
                      </div>
                      {editingPrompt !== config.key ? (
                        <button
                          onClick={() => startEditingPrompt(config.key)}
                          className="text-blue-600 hover:text-blue-700 cursor-pointer"
                        >
                          <FiEdit2 size={16} />
                        </button>
                      ) : (
                        <div className="flex space-x-1">
                          <button
                            onClick={savePrompt}
                            className="text-green-600 hover:text-green-700 cursor-pointer"
                          >
                            <FiCheck size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-3">
                    {editingPrompt === config.key ? (
                      <textarea
                        value={tempPrompt}
                        onChange={(e) => setTempPrompt(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-20 resize-none"
                        placeholder={`Enter ${config.label.toLowerCase()}...`}
                      />
                    ) : (
                      <div className="bg-gray-50 rounded p-2 min-h-20">
                        <p className="text-gray-700 whitespace-pre-wrap text-xs leading-relaxed">
                          {prompts[config.key]}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Email Processing Pipeline</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={loadMockEmails}
                    disabled={isLoading || emails.length > 0}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors cursor-pointer"
                  >
                    <FiUpload size={16} />
                    <span>Load Mock Inbox</span>
                  </button>
                  <button
                    onClick={processEmails}
                    disabled={isLoading || emails.length === 0}
                    className="flex items-center space-x-2 px-3 py-2 bg-green-500 text-white rounded-lg text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-600 transition-colors cursor-pointer"
                  >
                    <FiPlay size={16} />
                    <span>Process Emails</span>
                  </button>
                  <button
                    onClick={clearEmails}
                    disabled={isLoading || emails.length === 0}
                    className="flex items-center space-x-2 px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-red-600 transition-colors cursor-pointer"
                  >
                    <FiTrash2 size={16} />
                    <span>Clear</span>
                  </button>
                </div>
              </div>
              {isLoading && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Processing emails...</span>
                    <span>{Math.round(processingProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${processingProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4">
              {emails.length === 0 ? (
                <div className="text-center py-12">
                  <FiMail className="mx-auto text-gray-400" size={48} />
                  <h3 className="text-gray-900 font-medium mt-4">No emails loaded</h3>
                  <p className="text-gray-600 text-sm mt-2">Load mock inbox to start processing</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {emails.map((email) => (
                    <div key={email.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-semibold">
                                {email.sender.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-gray-900">{email.sender}</span>
                                <span className="text-gray-500 text-sm">{email.timestamp}</span>
                              </div>
                              <h3 className="font-medium text-gray-900 mt-1">{email.subject}</h3>
                            </div>
                          </div>
                          {email.processed && (
                            <div className="mt-3 space-y-2">
                              <div className="flex items-center space-x-4">
                                <div>
                                  <span className="text-xs text-gray-600">Category:</span>
                                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                    {email.category}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-600">Actions:</span>
                                  <span className="ml-2 text-xs text-gray-900">
                                    {email.actionItems.length} items
                                  </span>
                                </div>
                              </div>
                              {email.actionItems.length > 0 && (
                                <div className="bg-gray-50 rounded-lg p-3">
                                  <h4 className="text-xs font-semibold text-gray-900 mb-2">Action Items:</h4>
                                  <ul className="text-xs text-gray-700 space-y-1">
                                    {email.actionItems.map((item, index) => (
                                      <li key={index} className="flex items-center space-x-2">
                                        <FiCheck className="text-green-500" size={12} />
                                        <span>{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <div className={`w-3 h-3 rounded-full ${
                            email.processed ? 'bg-green-500' : 'bg-gray-300'
                          }`}></div>
                          {!email.processed && (
                            <span className="text-xs text-gray-500">Pending</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Knowledge Base</h2>
              <p className="text-gray-600 text-sm mt-1">Processed email insights and analytics</p>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {emails.filter(e => e.processed).length}
                  </div>
                  <div className="text-sm text-gray-600">Processed</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {emails.reduce((acc, email) => acc + email.actionItems.length, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Action Items</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {new Set(emails.filter(e => e.processed).map(e => e.category)).size}
                  </div>
                  <div className="text-sm text-gray-600">Categories</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptBrain;