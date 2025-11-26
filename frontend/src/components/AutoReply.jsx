import { useState, useEffect } from 'react';
import { FiCheck, FiRefreshCw, FiPlay, FiSettings } from 'react-icons/fi';

const AutoReply = () => {
  const [isAutoReplyEnabled, setIsAutoReplyEnabled] = useState(true);
  const [responseTemplate, setResponseTemplate] = useState(
    "Thank you for your email. I've received your message and will respond within 24 hours. For urgent matters, please contact our support team directly."
  );
  const [useAICustomization, setUseAICustomization] = useState(true);
  const [workingHoursOnly, setWorkingHoursOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ repliesSent: 0, successRate: 0, aiGenerated: 0 });
  const [recentReplies, setRecentReplies] = useState([]);
  const [testEmail, setTestEmail] = useState('');
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    loadAutoReplyData();
  }, []);

  const loadAutoReplyData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/v1/autoreply');
      const data = await response.json();
      
      setIsAutoReplyEnabled(data.settings.enabled);
      setResponseTemplate(data.settings.response_template);
      setUseAICustomization(data.settings.use_ai_customization);
      setWorkingHoursOnly(data.settings.working_hours_only);
      
      setStats({
        repliesSent: data.stats.replies_sent,
        successRate: data.stats.success_rate * 100,
        aiGenerated: data.stats.ai_generated_count
      });
      
      setRecentReplies(data.recent_replies);
    } catch (error) {
      console.error('Error loading auto-reply data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      const settings = {
        enabled: isAutoReplyEnabled,
        response_template: responseTemplate,
        use_ai_customization: useAICustomization,
        working_hours_only: workingHoursOnly
      };

      const response = await fetch('http://localhost:8000/api/v1/autoreply/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        alert('Auto-reply settings saved successfully!');
      } else {
        alert('Failed to save settings. Please try again.');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTestAutoReply = async () => {
    if (!testEmail.trim()) {
      alert('Please enter a test email content');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/v1/autoreply/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ test_email: testEmail })
      });

      const data = await response.json();
      setTestResult(data);
    } catch (error) {
      console.error('Error testing auto-reply:', error);
      alert('Error testing auto-reply. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAIResponse = async () => {
    if (!testEmail.trim()) {
      alert('Please enter email content first');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/v1/autoreply/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_content: testEmail,
          current_template: responseTemplate
        })
      });

      const data = await response.json();
      if (data.ai_generated) {
        setResponseTemplate(data.reply);
        alert('AI has personalized your response template!');
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      alert('Error generating AI response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const autoReplyStats = [
    { 
      value: stats.repliesSent.toString(), 
      label: 'This Month',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-800',
      borderColor: 'border-purple-200'
    },
    { 
      value: `${stats.successRate}%`, 
      label: 'Success Rate',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      borderColor: 'border-green-200'
    },
    { 
      value: stats.aiGenerated.toString(), 
      label: 'AI Generated',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-200'
    }
  ];

  if (loading) {
    return (
      <div className="px-6 py-4">
        <div className="mb-8 mt-3">
          <h1 className="text-3xl font-bold text-gray-900">AI Auto-Reply</h1>
          <p className="text-lg text-gray-600 mt-2">Configuring intelligent automatic email responses</p>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-4">
      <div className="mb-8 mt-3">
        <h1 className="text-3xl font-bold text-gray-900">AI Auto-Reply</h1>
        <p className="text-lg text-gray-600 mt-2">
          Configure intelligent automatic email responses
        </p>
        <button 
          onClick={loadAutoReplyData}
          className="mt-4 text-blue-600 hover:text-blue-800 cursor-pointer text-sm flex items-center space-x-1"
        >
          <FiRefreshCw size={14} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Test Auto-Reply Section */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Test Auto-Reply</h3>
        <div className="space-y-3">
          <textarea
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="Paste a sample email here to test the auto-reply functionality..."
            className="w-full border border-gray-300 rounded-lg p-3 min-h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex space-x-3">
            <button
              onClick={handleTestAutoReply}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center space-x-2"
            >
              <FiPlay size={16} />
              <span>Test Auto-Reply</span>
            </button>
            <button
              onClick={handleGenerateAIResponse}
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center space-x-2"
            >
              <FiSettings size={16} />
              <span>AI Personalize</span>
            </button>
          </div>
          {testResult && (
            <div className="mt-4 p-3 bg-white border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Test Result:</h4>
              <p className="text-sm text-gray-600 mb-2">{testResult.generated_reply}</p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>AI Generated: {testResult.ai_generated ? 'Yes' : 'No'}</span>
                <span>{new Date(testResult.timestamp).toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-row gap-8">
        <div className="flex-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">
                Auto-Reply Settings
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Enable Auto-Reply</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      AI will automatically respond to emails
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAutoReplyEnabled}
                      onChange={(e) => setIsAutoReplyEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">AI Personalization</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Customize responses based on email content
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useAICustomization}
                      onChange={(e) => setUseAICustomization(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Working Hours Only</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Only send auto-replies during business hours
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={workingHoursOnly}
                      onChange={(e) => setWorkingHoursOnly(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Default Response Template
                  </h3>
                  <textarea
                    value={responseTemplate}
                    onChange={(e) => setResponseTemplate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-4 min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                    placeholder="Enter your default auto-reply message..."
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    This template will be used for most incoming emails {useAICustomization && '(AI will personalize it)'}
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100 mt-6">
                <button
                  onClick={handleSaveSettings}
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiCheck size={20} />
                  <span>{loading ? 'Saving...' : 'Save Settings'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">
                  Auto-Reply Statistics
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {autoReplyStats.map((stat, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg border ${stat.borderColor} ${stat.bgColor}`}
                    >
                      <div className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</div>
                      <div className={`text-sm ${stat.textColor} opacity-80`}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">
                  Recent Auto-Replies
                </h2>
                <div className="space-y-4">
                  {recentReplies.map((reply, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="shrink-0">
                        <div className={`w-8 h-8 ${reply.status === 'success' ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center`}>
                          <FiCheck className={reply.status === 'success' ? 'text-green-500' : 'text-red-500'} size={16} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-semibold text-gray-900">{reply.reply_type}</h4>
                          <div className="flex items-center space-x-2">
                            {reply.ai_generated && (
                              <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                                AI
                              </span>
                            )}
                            <span className="text-xs text-gray-500">
                              {new Date(reply.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">To: {reply.recipient}</p>
                        <p className="text-xs text-gray-500 mt-1">{reply.subject}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoReply;