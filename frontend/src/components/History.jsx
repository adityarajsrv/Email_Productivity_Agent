import { AiOutlineMail } from "react-icons/ai";
import { FiFileText, FiRefreshCcw } from "react-icons/fi";
import { SlClock } from "react-icons/sl";

const History = () => {
  return (
    <div className="px-6 py-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">History</h1>
        <p className="text-md text-gray-600 mt-2">
          View all your email interactions and activities
        </p>
      </div>
      <div className="border border-black/10 rounded-lg w-full h-20 mt-5 px-6 py-4 bg-white shadow-md hover:shadow-lg cursor-pointer">
        <div className="flex px-4 py-3 rounded-2xl border-2 border-gray-300 overflow-hidden mx-auto">
          <input
            type="email"
            placeholder="Search history..."
            className="w-full outline-none bg-transparent text-gray-600 text-sm"
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
      <div className="border border-black/10 rounded-lg w-full mt-5 px-6 py-4 bg-white shadow-sm hover:shadow-lg cursor-pointer">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-start">
            <div className="flex flex-row items-start space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                <AiOutlineMail size={20} className="text-blue-600" />
              </div>
              <div className="flex flex-col">
                <div className="flex flex-row items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Q4 Marketing Strategy
                  </h3>
                  <span className="text-xs border border-gray-300 px-2 py-0.5 rounded-xl text-black font-semibold">
                    Draft
                  </span>
                </div>
                <div className="flex flex-row items-center space-x-2 mt-1">
                  <p className="text-sm text-gray-600 mr-5">
                    To: team@company.com
                  </p>
                  <SlClock size={14} className="mt-0.5 text-gray-500" />
                  <div className="text-sm text-gray-500">
                    2024-01-15 10:30 AM
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-between space-x-3 text-sm mt-4">
              <p className="rounded-xl border border-[#6467F2] text-white font-semibold px-2.5 pb-0.5 bg-[#6467F2]">sent</p>
              <button className="font-semibold cursor-pointer">View</button>
            </div>
          </div>
        </div>
      </div>
      <div className="border border-black/10 rounded-lg w-full mt-5 px-6 py-4 bg-white shadow-sm hover:shadow-lg cursor-pointer">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-start">
            <div className="flex flex-row items-start space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
                <FiRefreshCcw  size={20} className="text-purple-600" />
              </div>
              <div className="flex flex-col">
                <div className="flex flex-row items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Client Proposal
                  </h3>
                  <span className="text-xs border border-gray-300 px-2 py-0.5 rounded-xl text-black font-semibold">
                    Rewrite
                  </span>
                </div>
                <div className="flex flex-row items-center space-x-2 mt-1">
                  <p className="text-sm text-gray-600 mr-5">
                    To: client@example.com
                  </p>
                  <SlClock size={14} className="mt-0.5 text-gray-500" />
                  <div className="text-sm text-gray-500">
                    2024-01-15 09:15 AM
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-between space-x-3 text-sm mt-4">
              <p className="rounded-xl border border-gray-300 text-black font-semibold px-2.5 pb-0.5 bg-gray-300">draft</p>
              <button className="font-semibold cursor-pointer">View</button>
            </div>
          </div>
        </div>
      </div>
      <div className="border border-black/10 rounded-lg w-full mt-5 px-6 py-4 bg-white shadow-sm hover:shadow-lg cursor-pointer">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-start">
            <div className="flex flex-row items-start space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                <FiFileText size={20} className="text-green-600" />
              </div>
              <div className="flex flex-col">
                <div className="flex flex-row items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Weekly Team Update
                  </h3>
                  <span className="text-xs border border-gray-300 px-2 py-0.5 rounded-xl text-black font-semibold">
                    Summary
                  </span>
                </div>
                <div className="flex flex-row items-center space-x-2 mt-1">
                  <p className="text-sm text-gray-600 mr-5">
                    To: team@company.com
                  </p>
                  <SlClock size={14} className="mt-0.5 text-gray-500" />
                  <div className="text-sm text-gray-500">
                    2024-01-14 04:20 PM
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-between space-x-3 text-sm mt-4">
              <p className="rounded-xl border border-gray-300 text-black font-semibold px-2.5 pb-0.5 bg-gray-300">completed</p>
              <button className="font-semibold cursor-pointer">View</button>
            </div>
          </div>
        </div>
      </div>
      <div className="border border-black/10 rounded-lg w-full mt-5 px-6 py-4 bg-white shadow-sm hover:shadow-lg cursor-pointer">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-start">
            <div className="flex flex-row items-start space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                <AiOutlineMail size={20} className="text-blue-600" />
              </div>
              <div className="flex flex-col">
                <div className="flex flex-row items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Q4 Marketing Strategy
                  </h3>
                  <span className="text-xs border border-gray-300 px-2 py-0.5 rounded-xl text-black font-semibold">
                    Draft
                  </span>
                </div>
                <div className="flex flex-row items-center space-x-2 mt-1">
                  <p className="text-sm text-gray-600 mr-5">
                    To: team@company.com
                  </p>
                  <SlClock size={14} className="mt-0.5 text-gray-500" />
                  <div className="text-sm text-gray-500">
                    2024-01-15 10:30 AM
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-between space-x-3 text-sm mt-4">
              <p className="rounded-xl border border-[#6467F2] text-white font-semibold px-2.5 pb-0.5 bg-[#6467F2]">sent</p>
              <button className="font-semibold cursor-pointer">View</button>
            </div>
          </div>
        </div>
      </div>
      <div className="border border-black/10 rounded-lg w-full mt-5 px-6 py-4 bg-white shadow-sm hover:shadow-lg cursor-pointer">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-start">
            <div className="flex flex-row items-start space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                <AiOutlineMail size={20} className="text-blue-600" />
              </div>
              <div className="flex flex-col">
                <div className="flex flex-row items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Q4 Marketing Strategy
                  </h3>
                  <span className="text-xs border border-gray-300 px-2 py-0.5 rounded-xl text-black font-semibold">
                    Draft
                  </span>
                </div>
                <div className="flex flex-row items-center space-x-2 mt-1">
                  <p className="text-sm text-gray-600 mr-5">
                    To: team@company.com
                  </p>
                  <SlClock size={14} className="mt-0.5 text-gray-500" />
                  <div className="text-sm text-gray-500">
                    2024-01-15 10:30 AM
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-between space-x-3 text-sm mt-4">
              <p className="rounded-xl border border-[#6467F2] text-white font-semibold px-2.5 pb-0.5 bg-[#6467F2]">sent</p>
              <button className="font-semibold cursor-pointer">View</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
