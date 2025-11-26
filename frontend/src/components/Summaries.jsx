import { useState, useEffect } from 'react';
import { SlClock } from "react-icons/sl";
import { FiFileText, FiUser, FiAlertCircle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";

const Summaries = () => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadSummaries();
  }, []);

  const loadSummaries = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/v1/summaries');
      const data = await response.json();
      setSummaries(data);
    } catch (error) {
      console.error('Error loading summaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOriginal = async (emailId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/summaries/${emailId}`);
      const data = await response.json();
      setSelectedEmail(data);
      setShowModal(true);
    } catch (error) {
      console.error('Error loading email details:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEmail(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500 border-red-500';
      case 'medium':
        return 'bg-purple-500 border-purple-500';
      case 'low':
        return 'bg-green-500 border-green-500';
      default:
        return 'bg-gray-500 border-gray-500';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <FiCheckCircle className="text-green-500" size={16} />;
      case 'negative':
        return <FiAlertCircle className="text-red-500" size={16} />;
      case 'urgent':
        return <FiAlertCircle className="text-orange-500" size={16} />;
      default:
        return <FiInfo className="text-blue-500" size={16} />;
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="px-6 py-4">
        <div className="mb-8 mt-3">
          <h1 className="text-3xl font-bold text-gray-900">Email Summaries</h1>
          <p className="text-md text-gray-600 mt-2">AI-generated summaries of your emails</p>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-4">
      {/* Email Detail Modal */}
      {showModal && selectedEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Original Email</h2>
              <button
                onClick={closeModal}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-gray-600">From</label>
                    <p className="text-gray-900 font-medium">{selectedEmail.email.sender}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date</label>
                    <p className="text-gray-900 font-medium">{formatDate(selectedEmail.email.timestamp)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Priority</label>
                    <p className={`font-medium ${
                      selectedEmail.email.priority === 'high' ? 'text-red-600' : 
                      selectedEmail.email.priority === 'medium' ? 'text-purple-600' : 'text-green-600'
                    }`}>
                      {selectedEmail.email.priority.charAt(0).toUpperCase() + selectedEmail.email.priority.slice(1)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Subject</label>
                    <p className="text-gray-900 font-medium">{selectedEmail.email.subject}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Email Content</h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {selectedEmail.email.body}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Summary</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-gray-700">{selectedEmail.summary.summary}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="mb-8 mt-3">
        <h1 className="text-3xl font-bold text-gray-900">Email Summaries</h1>
        <p className="text-md text-gray-600 mt-2">
          AI-generated summaries of your emails
        </p>
        <div className="mt-2 text-sm text-gray-500">
          {summaries.length > 0 
            ? `Showing ${summaries.length} summarized email${summaries.length !== 1 ? 's' : ''}`
            : 'No summarized emails found'
          }
          <button 
            onClick={loadSummaries}
            className="ml-4 text-blue-600 hover:text-blue-800 cursor-pointer text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {summaries.length === 0 ? (
        <div className="border border-black/10 rounded-lg w-full mt-5 px-6 py-8 bg-white shadow-sm text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
            <FiFileText size={24} className="text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No summaries yet</h3>
          <p className="text-gray-500 text-sm">
            Process some emails in the History section to see AI-generated summaries here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {summaries.map((summary) => (
            <div 
              key={summary.id}
              className="border border-black/10 rounded-lg w-full px-6 py-4 bg-white shadow-md hover:shadow-lg cursor-pointer transition-all duration-200"
            >
              <div className="flex flex-row justify-between items-start">
                <div className="flex flex-row items-start space-x-3">
                  <div className="flex items-center space-x-2">
                    {getSentimentIcon(summary.sentiment)}
                    <h3 className="text-lg font-semibold text-gray-900">{summary.subject}</h3>
                  </div>
                  <span className={`text-xs border rounded-2xl px-3 py-1 text-white font-medium ${getPriorityColor(summary.priority)}`}>
                    {summary.priority}
                  </span>
                </div>
                <FiFileText size={20} className="text-blue-500 shrink-0" />
              </div>
              
              <div className="flex flex-row justify-start space-x-4 mt-2">
                <div className="flex flex-row items-center space-x-1.5 text-sm text-gray-500">
                  <FiUser size={16} />
                  <p>{summary.sender}</p>
                </div>
                <div className="flex flex-row items-center space-x-1.5 text-sm text-gray-500">
                  <SlClock size={16} />
                  <p>{formatDate(summary.timestamp)}</p>
                </div>
              </div>
              
              <p className="py-3 mt-2 text-gray-700 leading-relaxed">
                {summary.summary}
              </p>
              
              {summary.key_points && summary.key_points.length > 0 && (
                <div className="mt-2 mb-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Key Points:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {summary.key_points.slice(0, 3).map((point, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex flex-row justify-between items-center mt-4">
                <div className="flex flex-row flex-wrap gap-2">
                  {summary.tags && summary.tags.slice(0, 3).map((tag, index) => (
                    <span 
                      key={index}
                      className="text-xs border border-gray-300 rounded-2xl px-3 py-1 text-gray-700 font-medium bg-gray-50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button 
                  onClick={() => handleViewOriginal(summary.id)}
                  className="font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  View Original
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Summaries;