/* eslint-disable no-unused-vars */
import { AiOutlineMail, AiOutlineClose } from "react-icons/ai";
import { FiFileText, FiRefreshCcw, FiFilter, FiCheck, FiClock, FiCopy, FiExternalLink } from "react-icons/fi";
import { SlClock } from "react-icons/sl";
import { useState, useMemo, useEffect } from "react";

const History = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    tag: "all",
    date: "all",
  });
  const [processedEmails, setProcessedEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Load processed emails from backend
  useEffect(() => {
    loadProcessedEmails();
  }, []);

  const loadProcessedEmails = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8000/api/v1/emails/processed');
      const emails = await response.json();
      console.log('Loaded processed emails:', emails);
      setProcessedEmails(emails);
    } catch (error) {
      console.error('Error loading processed emails:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Transform processed emails to history items
  const historyItems = useMemo(() => {
    return processedEmails.map((email, index) => {
      // Determine icon and styling based on email content and processing
      let icon, iconColor, bgColor, tag, status, statusColor;
      
      // Determine tag based on email content and AI processing
      if (email.tags && email.tags.length > 0) {
        tag = email.tags[0].charAt(0).toUpperCase() + email.tags[0].slice(1).replace('-', ' ');
      } else if (email.priority === 'high') {
        tag = 'Urgent';
      } else if (email.action_items && email.action_items.length > 0) {
        tag = 'Action Required';
      } else {
        tag = 'Processed';
      }

      // Determine status and styling
      if (email.status === 'processed') {
        status = 'completed';
        statusColor = 'border-green-500 bg-green-500 text-white';
        icon = FiCheck;
        iconColor = 'text-green-600';
        bgColor = 'bg-green-100';
      } else {
        status = 'draft';
        statusColor = 'border-gray-300 bg-gray-300 text-black';
        icon = AiOutlineMail;
        iconColor = 'text-blue-600';
        bgColor = 'bg-blue-100';
      }

      // Format date
      const emailDate = new Date(email.timestamp);
      const formattedDate = emailDate.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
      const formattedTime = emailDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      return {
        id: email.id,
        emailData: email, // Store original email data
        icon: icon,
        iconColor: iconColor,
        bgColor: bgColor,
        title: email.subject,
        tag: tag,
        recipient: email.sender,
        date: `${formattedDate} ${formattedTime}`,
        status: status,
        statusColor: statusColor,
        actionItems: email.action_items || [],
        processedAt: email.processed_at,
        priority: email.priority,
        originalTimestamp: email.timestamp
      };
    });
  }, [processedEmails]);

  const filteredItems = useMemo(() => {
    let results = historyItems;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          item.recipient.toLowerCase().includes(term) ||
          item.tag.toLowerCase().includes(term) ||
          item.status.toLowerCase().includes(term)
      );
    }

    if (filters.status !== "all") {
      results = results.filter((item) => item.status === filters.status);
    }

    if (filters.tag !== "all") {
      results = results.filter(
        (item) => item.tag.toLowerCase() === filters.tag.toLowerCase()
      );
    }

    if (filters.date !== "all") {
      const today = new Date().toDateString();
      results = results.filter((item) => {
        const itemDate = new Date(item.originalTimestamp).toDateString();
        if (filters.date === "today") {
          return itemDate === today;
        } else if (filters.date === "last week") {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return new Date(item.originalTimestamp) >= weekAgo;
        }
        return true;
      });
    }

    return results;
  }, [searchTerm, filters, historyItems]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      status: "all",
      tag: "all",
      date: "all",
    });
    setSearchTerm("");
  };

  const handleView = (item) => {
    setSelectedEmail(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEmail(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // You could add a toast notification here
      console.log('Copied to clipboard');
    });
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const statusOptions = ["all", "completed", "draft"];
  const tagOptions = useMemo(() => {
    const tags = ["all", ...new Set(historyItems.map(item => item.tag.toLowerCase()))];
    return tags.filter(tag => tag !== "all");
  }, [historyItems]);
  
  const dateOptions = ["all", "today", "last week"];

  const activeFilterCount = Object.values(filters).filter(
    (value) => value !== "all"
  ).length;

  if (isLoading) {
    return (
      <div className="px-6 py-4">
        <div className="mb-8 mt-3">
          <h1 className="text-3xl font-bold text-gray-900">History</h1>
          <p className="text-md text-gray-600 mt-2">
            View all your email interactions and activities
          </p>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 ${selectedEmail.bgColor} rounded-full flex items-center justify-center`}>
                  <selectedEmail.icon size={24} className={selectedEmail.iconColor} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedEmail.title}</h2>
                  <p className="text-gray-600">From: {selectedEmail.recipient}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => copyToClipboard(selectedEmail.emailData.body)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Copy email content"
                >
                  <FiCopy size={18} />
                </button>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <AiOutlineClose size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Email Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Email Metadata */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Received</label>
                      <p className="text-gray-900 font-medium">{selectedEmail.date}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Priority</label>
                      <p className={`font-medium ${
                        selectedEmail.priority === 'high' ? 'text-red-600' : 
                        selectedEmail.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {selectedEmail.priority ? selectedEmail.priority.charAt(0).toUpperCase() + selectedEmail.priority.slice(1) : 'Normal'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Status</label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedEmail.statusColor}`}>
                        {getStatusText(selectedEmail.status)}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Category</label>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {selectedEmail.tag}
                      </span>
                    </div>
                  </div>

                  {/* Email Content */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Email Content</h3>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {selectedEmail.emailData.body}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column - AI Insights */}
                <div className="space-y-6">
                  {/* AI Processing Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center">
                      <FiCheck className="mr-2" />
                      AI Processing
                    </h3>
                    <p className="text-sm text-blue-700">
                      Processed on {new Date(selectedEmail.processedAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Action Items */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <FiCheck className="mr-2 text-green-600" />
                      Action Items ({selectedEmail.actionItems.length})
                    </h3>
                    {selectedEmail.actionItems.length > 0 ? (
                      <div className="space-y-2">
                        {selectedEmail.actionItems.map((action, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                          >
                            <div className="shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                              <span className="text-white text-xs font-bold">{index + 1}</span>
                            </div>
                            <p className="text-sm text-gray-700 flex-1">{action}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <FiFileText size={24} className="mx-auto mb-2 text-gray-400" />
                        <p>No action items identified</p>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {selectedEmail.emailData.tags && selectedEmail.emailData.tags.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedEmail.emailData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                          >
                            {tag.charAt(0).toUpperCase() + tag.slice(1).replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  copyToClipboard(selectedEmail.emailData.body);
                  closeModal();
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <FiCopy size={16} />
                <span>Copy & Close</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="mb-8 mt-3">
        <h1 className="text-3xl font-bold text-gray-900">History</h1>
        <p className="text-md text-gray-600 mt-2">
          View all your email interactions and activities
        </p>
        <div className="mt-2 text-sm text-gray-500">
          Showing {historyItems.length} processed email{historyItems.length !== 1 ? 's' : ''}
          <button 
            onClick={loadProcessedEmails}
            className="ml-4 text-blue-600 hover:text-blue-800 cursor-pointer text-sm"
          >
            Refresh
          </button>
        </div>
      </div>
      
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-4 items-center">
          <div className="border border-black/10 rounded-lg w-full h-20 px-6 py-4 bg-white shadow-md hover:shadow-lg cursor-pointer flex-1">
            <div className="flex px-4 py-3 rounded-2xl border-2 border-gray-300 overflow-hidden mx-auto">
              <input
                type="text"
                placeholder="Search history..."
                className="w-full outline-none bg-transparent text-gray-600 text-sm"
                value={searchTerm}
                onChange={handleSearch}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 192.904 192.904"
                width="16px"
                className="fill-gray-600"
              >
                <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
              </svg>
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`cursor-pointer flex items-center gap-2 px-4 py-3 rounded-2xl border-2 border-gray-300 bg-white hover:bg-gray-50 transition-colors ${
              activeFilterCount > 0 ? "border-blue-500 bg-blue-50" : ""
            }`}
          >
            <FiFilter size={16} className="text-gray-600" />
            <span className="text-sm text-gray-600">Filter</span>
            {activeFilterCount > 0 && (
              <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
        
        {showFilters && (
          <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option === "all"
                        ? "All"
                        : option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tag
                </label>
                <select
                  value={filters.tag}
                  onChange={(e) => handleFilterChange("tag", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                >
                  {tagOptions.map((option) => (
                    <option key={option} value={option}>
                      {option === "all"
                        ? "All"
                        : option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <select
                  value={filters.date}
                  onChange={(e) => handleFilterChange("date", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                >
                  {dateOptions.map((option) => (
                    <option key={option} value={option}>
                      {option === "all"
                        ? "All"
                        : option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={clearAllFilters}
                className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>
      
      {(searchTerm || activeFilterCount > 0) && (
        <div className="mt-4 text-sm text-gray-600 flex justify-between items-center">
          <span>
            Found {filteredItems.length} result
            {filteredItems.length !== 1 ? "s" : ""}
            {searchTerm && ` for '${searchTerm}'`}
            {activeFilterCount > 0 &&
              ` with ${activeFilterCount} filter${
                activeFilterCount !== 1 ? "s" : ""
              }`}
          </span>
          {(searchTerm || activeFilterCount > 0) && (
            <button
              className="cursor-pointer text-blue-600 hover:text-blue-800 text-sm"
              onClick={clearAllFilters}
            >
              Clear all
            </button>
          )}
        </div>
      )}
      
      {filteredItems.length > 0 ? (
        filteredItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.id}
              className="border border-black/10 rounded-lg w-full mt-5 px-6 py-4 bg-white shadow-sm hover:shadow-lg cursor-pointer transition-shadow duration-200"
              onClick={() => handleView(item)}
            >
              <div className="flex flex-col">
                <div className="flex flex-row justify-between items-start">
                  <div className="flex flex-row items-start space-x-4">
                    <div
                      className={`flex items-center justify-center w-10 h-10 ${item.bgColor} rounded-full`}
                    >
                      <IconComponent size={20} className={item.iconColor} />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex flex-row items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.title}
                        </h3>
                        <span className="text-xs border border-gray-300 px-2 py-0.5 rounded-xl text-black font-semibold">
                          {item.tag}
                        </span>
                      </div>
                      <div className="flex flex-row items-center space-x-2 mt-1">
                        <p className="text-sm text-gray-600 mr-5">
                          From: {item.recipient}
                        </p>
                        <SlClock size={14} className="mt-0.5 text-gray-500" />
                        <div className="text-sm text-gray-500">{item.date}</div>
                      </div>
                      {item.actionItems.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          <span className="text-xs text-gray-500">Actions: </span>
                          {item.actionItems.slice(0, 2).map((action, index) => (
                            <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {action.length > 30 ? action.substring(0, 30) + '...' : action}
                            </span>
                          ))}
                          {item.actionItems.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{item.actionItems.length - 2} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-row justify-between space-x-3 text-sm mt-4">
                    <p
                      className={`rounded-xl border font-semibold px-2.5 pb-0.5 ${item.statusColor}`}
                    >
                      {getStatusText(item.status)}
                    </p>
                    <button
                      className="font-semibold cursor-pointer text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(item);
                      }}
                    >
                      <FiExternalLink size={14} />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="border border-black/10 rounded-lg w-full mt-5 px-6 py-8 bg-white shadow-sm text-center">
          {historyItems.length === 0 ? (
            <div>
              <p className="text-gray-500">No processed emails found</p>
              <p className="text-sm text-gray-400 mt-2">
                Process some emails in the Prompt Brain to see them here
              </p>
            </div>
          ) : (
            <div>
              <p className="text-gray-500">No results found</p>
              <button
                className="cursor-pointer mt-2 text-blue-600 hover:text-blue-800"
                onClick={clearAllFilters}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default History;