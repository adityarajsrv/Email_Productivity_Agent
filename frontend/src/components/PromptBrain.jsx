/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { FiEdit2, FiMail, FiUpload, FiPlay, FiCheck, FiTrash2 } from 'react-icons/fi';

const PromptBrain = () => {
  const [activeTab, setActiveTab] = useState('prompts');
  const [prompts, setPrompts] = useState({
    action_items: '',
    auto_reply: ''
  });
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [tempPrompt, setTempPrompt] = useState('');
  const [emails, setEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/prompts');
      const promptsData = await response.json();
      console.log('Loaded prompts:', promptsData);
      setPrompts(promptsData);
    } catch (error) {
      console.error('Error loading prompts:', error);
    }
  };

  const startEditingPrompt = (promptType) => {
    setEditingPrompt(promptType);
    setTempPrompt(prompts[promptType]);
  };

  const savePrompt = async () => {
    if (tempPrompt.trim() && editingPrompt) {
      try {
        const response = await fetch('http://localhost:8000/api/v1/prompts', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt_type: editingPrompt,
            content: tempPrompt
          })
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('Prompt updated:', result);
          setPrompts(prev => ({ ...prev, [editingPrompt]: tempPrompt }));
          await loadPrompts();
        }
      } catch (error) {
        console.error('Error updating prompt:', error);
      }
    }
    setEditingPrompt(null);
    setTempPrompt('');
  };

  const cancelEditing = () => {
    setEditingPrompt(null);
    setTempPrompt('');
  };

  const loadMockEmails = async () => {
    setIsLoading(true);
    try {
      console.log('Loading mock emails...');
      const response = await fetch('http://localhost:8000/api/v1/emails/load-mock', {
        method: 'POST'
      });
      const result = await response.json();
      console.log('Mock emails API response:', result);
      
      await loadEmails();
      console.log('Mock emails loaded successfully');
    } catch (error) {
      console.error('Error loading emails:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadEmails = async () => {
    try {
      console.log('Fetching emails from API...');
      const response = await fetch('http://localhost:8000/api/v1/emails');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const emailsData = await response.json();
      console.log('Raw emails API response:', emailsData);
      
      // Check if we have the expected data structure
      if (emailsData && emailsData.emails && Array.isArray(emailsData.emails)) {
        console.log(`Found ${emailsData.emails.length} emails`);
        
        const transformedEmails = emailsData.emails.map((email, index) => {
          console.log(`Email ${index}:`, email);
          
          // Handle timestamp conversion safely
          let formattedTimestamp;
          try {
            formattedTimestamp = new Date(email.timestamp).toLocaleString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            });
          } catch (e) {
            console.warn('Error formatting timestamp:', e);
            formattedTimestamp = 'Unknown date';
          }
          
          return {
            id: email.id || `email-${index}`,
            sender: email.sender || 'Unknown sender',
            subject: email.subject || 'No subject',
            timestamp: formattedTimestamp,
            body: email.body || 'No content',
            category: (email.tags && email.tags.length > 0) ? email.tags[0] : 'Uncategorized',
            actionItems: email.action_items || [],
            processed: email.status === 'processed'
          };
        });
        
        console.log('Transformed emails:', transformedEmails);
        setEmails(transformedEmails);
      } else {
        console.error('Unexpected API response structure:', emailsData);
        setEmails([]);
      }
    } catch (error) {
      console.error('Error loading emails:', error);
      setEmails([]);
    }
  };

  const processEmails = async () => {
    setIsLoading(true);
    setProcessingProgress(0);
    
    try {
      const response = await fetch('http://localhost:8000/api/v1/emails/process', {
        method: 'POST'
      });
      const result = await response.json();
      console.log('Processing started:', result);
      await pollForProcessedEmails();
    } catch (error) {
      console.error('Error processing emails:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const pollForProcessedEmails = async () => {
    let attempts = 0;
    const maxAttempts = 30;
    
    const poll = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/emails/processed');
        const processedEmails = await response.json();
        
        const totalEmails = emails.length;
        const processedCount = processedEmails.length;
        const progress = totalEmails > 0 ? (processedCount / totalEmails) * 100 : 0;
        setProcessingProgress(progress);
        
        console.log(`Polling: ${processedCount}/${totalEmails} processed (${progress}%)`);
        
        if (processedCount > 0) {
          await loadEmails();
        }
        
        if (processedCount < totalEmails && attempts < maxAttempts) {
          attempts++;
          setTimeout(poll, 1000);
        }
      } catch (error) {
        console.error('Error polling for processed emails:', error);
      }
    };
    
    await poll();
  };

  const clearEmails = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/emails', {
        method: 'DELETE'
      });
      const result = await response.json();
      setEmails([]);
      setProcessingProgress(0);
      console.log('Emails cleared:', result);
    } catch (error) {
      console.error('Error clearing emails:', error);
    }
  };

  const promptConfigs = [
    {
      key: 'action_items',
      label: 'Action Item Prompt',
      description: 'Extracts tasks, deadlines, and responsibilities'
    },
    {
      key: 'auto_reply',
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
      
      {/* Debug info - remove in production */}
      <div className="mb-4 p-2 bg-yellow-100 border border-yellow-400 rounded">
        <p className="text-sm text-yellow-800">
          Debug: {emails.length} emails loaded | API calls working
        </p>
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
                          {prompts[config.key] || 'No prompt loaded...'}
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
                    disabled={isLoading}
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
                  <button 
                    onClick={loadMockEmails}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Load Emails Now
                  </button>
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