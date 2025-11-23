import { useState } from 'react';
import { FiCheck } from 'react-icons/fi';

const AutoReply = () => {
  const [isAutoReplyEnabled, setIsAutoReplyEnabled] = useState(true);
  const [responseTemplate, setResponseTemplate] = useState(
    "Thank you for your email. I've received your message and will respond within 24 hours. For urgent matters, please contact our support team directly."
  );

  const handleSaveSettings = () => {
    alert('Auto-reply settings saved successfully!');
  };

  const autoReplyStats = [
    { 
      value: '89', 
      label: 'This Month',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-800',
      borderColor: 'border-purple-200'
    },
    { 
      value: '96%', 
      label: 'Success Rate',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      borderColor: 'border-green-200'
    }
  ];

  const recentReplies = [
    {
      type: 'Meeting Request',
      count: '12x',
      status: 'success',
      description: 'Auto-scheduled meeting based on calendar availability'
    },
    {
      type: 'Support Inquiry',
      count: '8x',
      status: 'success',
      description: 'Sent to support team with ticket number'
    },
    {
      type: 'Newsletter Subscription',
      count: '5x',
      status: 'success',
      description: 'Confirmed subscription and sent welcome email'
    }
  ];

  return (
    <div className="px-6 py-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI Auto-Reply</h1>
        <p className="text-lg text-gray-600 mt-2">
          Configure intelligent automatic email responses
        </p>
      </div> 
      <div className="flex flex-row gap-8">
        <div className="flex-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">
                Auto-Reply Settings
              </h2>
              <p className="text-gray-600 mb-6">
                Configure how AI responds to incoming emails
              </p>
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
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
              </div>
              <div className="mb-6">
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
                  This template will be used for most incoming emails
                </p>
              </div>
              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  onClick={handleSaveSettings}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <FiCheck size={20} />
                  <span>Save Settings</span>
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
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <FiCheck className="text-green-500" size={16} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-semibold text-gray-900">{reply.type}</h4>
                          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                            {reply.count}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{reply.description}</p>
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