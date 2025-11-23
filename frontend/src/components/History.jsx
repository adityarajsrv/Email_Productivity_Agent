import { AiOutlineMail } from "react-icons/ai";
import { FiFileText, FiRefreshCcw, FiFilter } from "react-icons/fi";
import { SlClock } from "react-icons/sl";
import { useState, useMemo } from "react";

const History = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    tag: "all",
    date: "all",
  });

  const historyItems = useMemo(
    () => [
      {
        id: 1,
        icon: AiOutlineMail,
        iconColor: "text-blue-600",
        bgColor: "bg-blue-100",
        title: "Q4 Marketing Strategy",
        tag: "Draft",
        recipient: "team@company.com",
        date: "2024-01-15 10:30 AM",
        status: "draft",
        statusColor: "border-gray-300 bg-gray-300 text-black",
      },
      {
        id: 2,
        icon: FiRefreshCcw,
        iconColor: "text-purple-600",
        bgColor: "bg-purple-100",
        title: "Client Proposal Document",
        tag: "Rewrite",
        recipient: "client@example.com",
        date: "2024-01-15 09:15 AM",
        status: "sent",
        statusColor: "border-[#6467F2] bg-[#6467F2] text-white",
      },
      {
        id: 3,
        icon: FiFileText,
        iconColor: "text-green-600",
        bgColor: "bg-green-100",
        title: "Weekly Team Update",
        tag: "Summary",
        recipient: "team@company.com",
        date: "2024-01-14 04:20 PM",
        status: "completed",
        statusColor: "border-gray-300 bg-gray-300 text-black",
      },
      {
        id: 4,
        icon: AiOutlineMail,
        iconColor: "text-blue-600",
        bgColor: "bg-blue-100",
        title: "Budget Approval Request",
        tag: "Urgent",
        recipient: "finance@company.com",
        date: "2024-01-14 02:45 PM",
        status: "sent",
        statusColor: "border-[#6467F2] bg-[#6467F2] text-white",
      },
      {
        id: 5,
        icon: FiRefreshCcw,
        iconColor: "text-orange-600",
        bgColor: "bg-orange-100",
        title: "Project Timeline Review",
        tag: "Revision",
        recipient: "pm@company.com",
        date: "2024-01-14 11:20 AM",
        status: "draft",
        statusColor: "border-gray-300 bg-gray-300 text-black",
      },
      {
        id: 6,
        icon: FiFileText,
        iconColor: "text-red-600",
        bgColor: "bg-red-100",
        title: "Emergency Meeting Notes",
        tag: "Important",
        recipient: "leadership@company.com",
        date: "2024-01-13 03:30 PM",
        status: "sent",
        statusColor: "border-[#6467F2] bg-[#6467F2] text-white",
      },
    ],
    []
  );

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
        const itemDate = new Date(item.date.split(" ")[0]).toDateString();
        if (filters.date === "today") {
          return itemDate === today;
        } else if (filters.date === "last week") {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return new Date(item.date.split(" ")[0]) >= weekAgo;
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

  const handleView = (itemId) => {
    alert(`Viewing item ${itemId}`);
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  const statusOptions = ["all", "draft", "sent", "completed"];
  const tagOptions = [
    "all",
    "draft",
    "rewrite",
    "summary",
    "urgent",
    "revision",
    "important",
  ];
  const dateOptions = ["all", "today", "last week"];

  const activeFilterCount = Object.values(filters).filter(
    (value) => value !== "all"
  ).length;

  return (
    <div className="px-6 py-4">
      <div className="mb-8 mt-3">
        <h1 className="text-3xl font-bold text-gray-900">History</h1>
        <p className="text-md text-gray-600 mt-2">
          View all your email interactions and activities
        </p>
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
              onClick={() => handleView(item.id)}
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
                          To: {item.recipient}
                        </p>
                        <SlClock size={14} className="mt-0.5 text-gray-500" />
                        <div className="text-sm text-gray-500">{item.date}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row justify-between space-x-3 text-sm mt-4">
                    <p
                      className={`rounded-xl border font-semibold px-2.5 pb-0.5 ${item.statusColor}`}
                    >
                      {getStatusText(item.status)}
                    </p>
                    <button
                      className="font-semibold cursor-pointer text-blue-600 hover:text-blue-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(item.id);
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="border border-black/10 rounded-lg w-full mt-5 px-6 py-8 bg-white shadow-sm text-center">
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
  );
};

export default History;
