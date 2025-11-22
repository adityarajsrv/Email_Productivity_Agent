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

  const generateRewrittenEmail = (original, selectedTone) => {
    const toneTemplates = {
      Professional: `Dear Team,

I hope this message finds you well. I am writing to follow up on our recent discussion regarding the upcoming project timeline and key deliverables.

To ensure we maintain our momentum, I would like to propose the following action items:

1. Complete the requirements documentation by EOD Friday
2. Schedule a comprehensive technical review for early next week
3. Initiate coordination with the design team for initial mockups

I am confident that by adhering to this timeline, we will position ourselves for successful project execution. Please feel free to reach out if you require any clarification or have additional insights to contribute.

Best regards,
[Your Name]`,

      Casual: `Hey team! 👋

Just wanted to quickly follow up on our chat about the project timeline. Here's what we're looking at:

• Wrap up the requirements doc by Friday
• Let's do a tech review sometime next week
• Need to sync up with the design folks for mockups

Think we're in good shape here! Hit me up if anything's unclear or if you've got other ideas.

Cheers!
[Your Name]`,

      Friendly: `Hi everyone! 😊

Hope you're all having a great week! Following up on our project timeline discussion - here's the plan moving forward:

✨ Let's get the requirements wrapped up by Friday
✨ We'll schedule a friendly tech review for next week
✨ I'll reach out to the design team to get those mockups started

Really excited about where this is heading! As always, please don't hesitate to reach out if you have questions or suggestions.

Warm regards,
[Your Name]`,

      Formal: `To Whom It May Concern,

I am writing to formally address the matters discussed during our recent meeting concerning the project timeline and associated deliverables.

Pursuant to our conversation, the following action items have been identified as imperative:

1. The requirements documentation must be finalized no later than Friday of this week
2. A technical review session shall be scheduled for the forthcoming week
3. Coordination with the design department regarding mockups should commence immediately

Your prompt attention to these matters is greatly appreciated. Should you require further clarification, please do not hesitate to contact me at your earliest convenience.

Respectfully yours,
[Your Name]`,

      Urgent: `URGENT: Project Timeline Follow-up

Team,

This requires your immediate attention. Following our meeting, here are the critical action items that must be addressed:

🚨 REQUIREMENTS DOCUMENTATION - DUE FRIDAY
🚨 TECHNICAL REVIEW - SCHEDULE FOR NEXT WEEK
🚨 DESIGN MOCKUPS - COORDINATE IMMEDIATELY

Time is of the essence. Please prioritize these items and confirm completion by the specified deadlines. Any delays could impact the entire project timeline.

Action required immediately,
[Your Name]`,

      Persuasive: `Hello Team,

I'm excited to share an incredible opportunity we have to significantly advance our project! Based on our productive discussion, I've outlined a compelling path forward:

🌟 By completing the requirements documentation by Friday, we'll unlock tremendous momentum
🌟 A technical review next week will ensure we're building on a solid foundation
🌟 Engaging with design now will give us the visual assets we need to succeed

I truly believe this approach will position us for outstanding results. Your expertise and commitment are invaluable to making this happen - together, we can achieve something remarkable!

Looking forward to our continued success,
[Your Name]`
    };

    return toneTemplates[selectedTone] || toneTemplates.Professional;
  };

  const handleRewriteEmail = () => {
    if (!originalEmail.trim()) return;
    
    setIsRewriting(true);
    
    setTimeout(() => {
      const rewritten = generateRewrittenEmail(originalEmail, tone);
      setRewrittenEmail(rewritten);
      setIsRewriting(false);
    }, 1200);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Email Rewrite</h1>
        <p className="text-md text-gray-600 mt-2">Transform your email&apos;s tone and style</p>
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
                  placeholder="Paste your email here... (e.g., 'Hey team, we need to finish the project by Friday. Let me know if there are any issues.')"
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
                      <span>Rewriting...</span>
                    </>
                  ) : (
                    <>
                      <VscSparkle size={20} />
                      <span>Rewrite Email</span>
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
                <h2 className="text-xl font-semibold text-gray-900">Rewritten Version</h2>
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
                    {!editingEmail ? (
                      <>
                        <div className="bg-white rounded-lg p-4 border border-green-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium text-green-700">Rewritten in {tone} tone</span>
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
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm font-medium text-blue-700">Editing rewritten email</span>
                          </div>
                          <textarea
                            value={tempEmail}
                            onChange={(e) => setTempEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-4 min-h-[300px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            placeholder="Edit your rewritten email..."
                          />
                        </div>
                        <div className="flex space-x-3 pt-4 border-t border-gray-200">
                          <button 
                            onClick={saveEditedEmail}
                            className="cursor-pointer flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                          >
                            <FiSave size={16} />
                            <span>Save</span>
                          </button>
                          <button 
                            onClick={cancelEditingEmail}
                            className="cursor-pointer flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                          >
                            <FiX size={16} />
                            <span>Cancel</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                      <FiEdit2 size={24} className="text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No email rewritten yet</h3>
                    <p className="text-gray-500 text-sm max-w-xs">
                      Paste your original email and select a tone, then click &quot;Rewrite Email&quot; to transform it.
                    </p>
                  </div>
                )}
              </div>

              {!rewrittenEmail && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <FiInfo size={20} className="text-blue-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Pro Tip</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Different tones work best for different situations. Professional for business, Casual for colleagues, and Friendly for informal communication.
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