import { useState } from 'react';
import { VscSparkle } from 'react-icons/vsc';
import { FiCopy, FiMail, FiEdit2, FiTrash2, FiInfo, FiX, FiSave } from 'react-icons/fi';

const DraftEmail = () => {
  const [context, setContext] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipient, setRecipient] = useState({ name: 'John Doe', email: 'john@example.com' });
  const [subject, setSubject] = useState('Meeting follow-up');
  const [copied, setCopied] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState(false);
  const [editingSubject, setEditingSubject] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [tempRecipient, setTempRecipient] = useState({ name: '', email: '' });
  const [tempSubject, setTempSubject] = useState('');
  const [tempEmail, setTempEmail] = useState('');

  const handleGenerateEmail = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const sampleEmail = `Dear ${recipient.name},\n\nFollowing up on our meeting earlier, I wanted to summarize the key points we discussed regarding the upcoming project timeline.\n\nKey Action Items:\n1. Finalize requirements by Friday\n2. Schedule technical review for next week\n3. Coordinate with design team for mockups\n\n${context}\n\nPlease let me know if you have any questions or need clarification on any of these points.\n\nBest regards,\n[Your Name]`;

      setGeneratedEmail(sampleEmail);
      setIsGenerating(false);
    }, 1500);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(generatedEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmail = () => {
    alert(`Email would be sent to: ${recipient.email}\n\nSubject: ${subject}\n\n${generatedEmail}`);
  };

  const startEditingEmail = () => {
    setTempEmail(generatedEmail);
    setEditingEmail(true);
  };

  const saveEditedEmail = () => {
    if (tempEmail.trim()) {
      setGeneratedEmail(tempEmail);
    }
    setEditingEmail(false);
  };

  const cancelEditingEmail = () => {
    setEditingEmail(false);
    setTempEmail('');
  };

  const startEditingRecipient = () => {
    setTempRecipient(recipient);
    setEditingRecipient(true);
  };

  const saveRecipient = () => {
    if (tempRecipient.name.trim() && tempRecipient.email.trim()) {
      setRecipient(tempRecipient);
    }
    setEditingRecipient(false);
  };

  const cancelEditingRecipient = () => {
    setEditingRecipient(false);
    setTempRecipient({ name: '', email: '' });
  };

  const startEditingSubject = () => {
    setTempSubject(subject);
    setEditingSubject(true);
  };

  const saveSubject = () => {
    if (tempSubject.trim()) {
      setSubject(tempSubject);
    }
    setEditingSubject(false);
  };

  const cancelEditingSubject = () => {
    setEditingSubject(false);
    setTempSubject('');
  };

  const clearAll = () => {
    setContext('');
    setGeneratedEmail('');
  };

  return (
    <div className="px-6 py-4">
      {/* Editing Modals */}
      {editingRecipient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Edit Recipient</h2>
              <button
                onClick={cancelEditingRecipient}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Name</label>
                <input
                  type="text"
                  value={tempRecipient.name}
                  onChange={(e) => setTempRecipient({ ...tempRecipient, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter recipient name"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Email</label>
                <input
                  type="email"
                  value={tempRecipient.email}
                  onChange={(e) => setTempRecipient({ ...tempRecipient, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter recipient email"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={cancelEditingRecipient}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveRecipient}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {editingSubject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Edit Subject</h2>
              <button
                onClick={cancelEditingSubject}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="p-6">
              <input
                type="text"
                value={tempSubject}
                onChange={(e) => setTempSubject(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email subject"
              />
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={cancelEditingSubject}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveSubject}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {editingEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Edit Email Content</h2>
              <button
                onClick={cancelEditingEmail}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="p-6">
              <textarea
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-4 min-h-[400px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                placeholder="Edit your email..."
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
        <h1 className="text-3xl font-bold text-gray-900">AI Email Drafting</h1>
        <p className="text-md text-gray-500 mt-2">Let AI help you write professional emails</p>
      </div>
      
      <div className="flex flex-row gap-8">
        <div className="flex-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">Email Details</h2>              
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Recipient</h3>
                  <button 
                    onClick={startEditingRecipient}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                  >
                    Change
                  </button>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm font-semibold">{recipient.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">{recipient.name}</p>
                    <p className="text-gray-500 text-sm">{recipient.email}</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Subject</h3>
                    <button 
                      onClick={startEditingSubject}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-900 font-medium">{subject}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Context / Key Points</h3>
                  <span className="text-xs text-gray-500">{context.length}/500</span>
                </div>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Describe what you want to communicate, key points, tone, and any specific requirements..."
                  className="w-full border border-gray-300 rounded-lg p-4 min-h-[180px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">Be specific for better results</p>
                  <div className="space-x-2">
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
                  onClick={handleGenerateEmail}
                  disabled={!context.trim() || isGenerating}
                  className={`cursor-pointer font-semibold py-3 px-8 w-full rounded-lg transition-all duration-200 flex justify-center items-center space-x-2 ${
                    context.trim() && !isGenerating
                      ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <VscSparkle size={20} />
                      <span>Generate Email</span>
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
                <h2 className="text-xl font-semibold text-gray-900">Generated Email</h2>
                {generatedEmail && !editingEmail && (
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
                {generatedEmail ? (
                  <div className="space-y-4">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed font-medium">
                      {generatedEmail}
                    </div>
                    <div className="flex space-x-3 pt-4 border-t border-gray-200">
                      <button 
                        onClick={handleSendEmail}
                        className="cursor-pointer flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <FiMail size={16} />
                        <span>Send Email</span>
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
                      <FiMail size={24} className="text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No email generated yet</h3>
                    <p className="text-gray-500 text-sm max-w-xs">
                      Enter your context and key points, then click &quot;Generate Email&quot; to create your professional email.
                    </p>
                  </div>
                )}
              </div>
              
              {!generatedEmail && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <FiInfo size={20} className="text-blue-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Pro Tip</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Include specific details like tone (professional, casual), key points to cover, and any call-to-action for better results.
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

export default DraftEmail;