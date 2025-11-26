import { useState } from 'react';
import { VscSparkle } from 'react-icons/vsc';
import { FiCopy, FiEdit2, FiTrash2, FiInfo, FiSave, FiX } from 'react-icons/fi';

const Rewrite = () => {
  const [originalEmail, setOriginalEmail] = useState('');
  const [rewrittenEmail, setRewrittenEmail] = useState('');
  const [isRewriting, setIsRewriting] = useState(false);
  const [tone, setTone] = useState('Professional');
  const [copied, setCopied] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [tempEmail, setTempEmail] = useState('');

  const handleRewriteEmail = async () => {
    if (!originalEmail.trim()) return;
    
    setIsRewriting(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/v1/rewrite-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: originalEmail,
          tone: tone
        })
      });

      if (!response.ok) {
        throw new Error('Failed to rewrite email');
      }

      const data = await response.json();
      setRewrittenEmail(data.rewritten_email);
    } catch (error) {
      console.error('Error rewriting email:', error);
      alert('Failed to rewrite email. Please try again.');
    } finally {
      setIsRewriting(false);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(rewrittenEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setOriginalEmail('');
    setRewrittenEmail('');
  };

  const startEditingEmail = () => {
    setTempEmail(rewrittenEmail);
    setEditingEmail(true);
  };

  const saveEditedEmail = () => {
    if (tempEmail.trim()) {
      setRewrittenEmail(tempEmail);
    }
    setEditingEmail(false);
  };

  const cancelEditingEmail = () => {
    setEditingEmail(false);
    setTempEmail('');
  };

  const handleUseAsOriginal = () => {
    setOriginalEmail(rewrittenEmail);
    setRewrittenEmail('');
  };

  const tones = [
    { value: 'Professional', description: 'Business-appropriate language' },
    { value: 'Casual', description: 'Relaxed, informal tone' },
    { value: 'Friendly', description: 'Warm and approachable' },
    { value: 'Formal', description: 'Official and structured' },
    { value: 'Urgent', description: 'Time-sensitive and direct' },
    { value: 'Persuasive', description: 'Convincing and motivational' }
  ];

  return (
    <div className="px-6 py-4">
      {/* Edit Email Modal */}
      {editingEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Edit Rewritten Email</h2>
              <button
                onClick={cancelEditingEmail}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-blue-700">Editing email in {tone} tone</span>
                </div>
              </div>
              <textarea
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-4 min-h-[400px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                placeholder="Edit your rewritten email..."
              />
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={cancelEditingEmail}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveEditedEmail}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <FiSave size={16} />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="mb-8 mt-3">
        <h1 className="text-3xl font-bold text-gray-900">Email Rewrite</h1>
        <p className="text-md text-gray-600 mt-2">Transform your email&apos;s tone and style using AI</p>
      </div>
      
      <div className="flex flex-row gap-8">
        <div className="flex-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">Original Email</h2>
              
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Tone</h3>
                <div className="flex flex-wrap gap-2">
                  {tones.map((toneOption) => (
                    <button
                      key={toneOption.value}
                      onClick={() => setTone(toneOption.value)}
                      className={`px-4 py-2 rounded-lg border transition-all duration-200 text-sm font-medium ${
                        tone === toneOption.value
                          ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500 hover:text-blue-600'
                      }`}
                      title={toneOption.description}
                    >
                      {toneOption.value}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Your Email Text</h3>
                <textarea
                  value={originalEmail}
                  onChange={(e) => setOriginalEmail(e.target.value)}
                  placeholder="Paste any email here that you want to rewrite in a different tone..."
                  className="w-full border border-gray-300 rounded-lg p-4 min-h-[250px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">
                    {originalEmail.length > 0 ? `${originalEmail.length} characters` : 'Paste the email you want to rewrite'}
                  </p>
                  <div className="space-x-2">
                    {rewrittenEmail && (
                      <button 
                        onClick={handleUseAsOriginal}
                        className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer flex items-center space-x-1"
                      >
                        <span>Use Rewritten</span>
                      </button>
                    )}
                    <button 
                      onClick={clearAll}
                      className="text-xs text-red-500 hover:text-red-700 cursor-pointer flex items-center space-x-1"
                    >
                      <FiTrash2 size={12} />
                      <span>Clear</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button 
                  onClick={handleRewriteEmail}
                  disabled={!originalEmail.trim() || isRewriting}
                  className={`cursor-pointer font-semibold py-3 px-8 w-full rounded-lg transition-all duration-200 flex justify-center items-center space-x-2 ${
                    originalEmail.trim() && !isRewriting
                      ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isRewriting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Rewriting with AI...</span>
                    </>
                  ) : (
                    <>
                      <VscSparkle size={20} />
                      <span>Rewrite with AI</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">AI Rewritten Version</h2>
                {rewrittenEmail && !editingEmail && (
                  <button 
                    onClick={handleCopyEmail}
                    className="cursor-pointer flex items-center space-x-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    <FiCopy size={16} />
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                )}
              </div>

              <div className="flex-1 border border-gray-300 rounded-lg p-6 bg-gray-50/50 transition-all duration-300">
                {rewrittenEmail ? (
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-green-700">AI Rewritten in {tone} tone</span>
                      </div>
                      <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                        {rewrittenEmail}
                      </div>
                    </div>
                    <div className="flex space-x-3 pt-4 border-t border-gray-200">
                      <button 
                        onClick={handleCopyEmail}
                        className="cursor-pointer flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <FiCopy size={16} />
                        <span>Copy Text</span>
                      </button>
                      <button 
                        onClick={startEditingEmail}
                        className="cursor-pointer flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <FiEdit2 size={16} />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                      <VscSparkle size={24} className="text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Rewrite Ready</h3>
                    <p className="text-gray-500 text-sm max-w-xs">
                      Paste any email and select a tone, then click &quot;Rewrite with AI&quot; to transform it using our AI backend.
                    </p>
                  </div>
                )}
              </div>

              {!rewrittenEmail && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <FiInfo size={20} className="text-blue-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Powered by AI</p>
                      <p className="text-xs text-blue-700 mt-1">
                        This uses our AI backend to understand your email content and rewrite it in your chosen tone while preserving the original meaning.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rewrite;