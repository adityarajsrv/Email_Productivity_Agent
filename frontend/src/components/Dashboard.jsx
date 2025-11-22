import { CiMail } from "react-icons/ci";
import { WiTime4 } from "react-icons/wi";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";

const Dashboard = () => {
  return (
    <div className="px-3 mr-2">
      <h1 className="text-3xl font-bold px-4 py-2 mt-5">Dashboard</h1>
      <p className="px-4 text-md text-gray-600">
        Your AI email assistant overview
      </p>
      <div className="flex flex-row justify-between items-center space-x-3">
        <div className="border border-black/10 rounded-lg w-68 h-34 mt-5 ml-4 bg-white shadow-md hover:shadow-lg cursor-pointer">
          <div className="flex flex-row justify-between">
            <h2 className="text-lg text-gray-600 px-4 mt-3 py-2">
              Emails Drafted
            </h2>
            <CiMail size={22} className="mt-6 mr-4 text-blue-600" />
          </div>
          <p className="text-3xl font-bold ml-4">247</p>
          <p className="text-xs text-green-500 ml-4 py-2">
            +12% from last month
          </p>
        </div>
        <div className="border border-black/10 rounded-lg w-68 h-34 mt-5 ml-4 bg-white shadow-md hover:shadow-lg cursor-pointer">
          <div className="flex flex-row justify-between">
            <h2 className="text-lg text-gray-600 px-4 mt-3 py-2">Time Saved</h2>
            <WiTime4 size={22} className="mt-6 mr-4 text-green-500" />
          </div>
          <p className="text-3xl font-bold ml-4">18.5h</p>
          <p className="text-xs text-green-500 ml-4 py-2">
            +8% from last month
          </p>
        </div>
        <div className="border border-black/10 rounded-lg w-68 h-34 mt-5 ml-4 bg-white shadow-md hover:shadow-lg cursor-pointer">
          <div className="flex flex-row justify-between">
            <h2 className="text-lg text-gray-600 px-4 mt-3 py-2">
              Auto Replies
            </h2>
            <AiOutlineThunderbolt
              size={22}
              className="mt-6 mr-4 text-purple-600"
            />
          </div>
          <p className="text-3xl font-bold ml-4">89</p>
          <p className="text-xs text-green-500 ml-4 py-2">
            +23% from last month
          </p>
        </div>
        <div className="border border-black/10 rounded-lg w-68 h-34 mt-5 ml-4 bg-white shadow-md hover:shadow-lg cursor-pointer">
          <div className="flex flex-row justify-between">
            <h2 className="text-lg text-gray-600 px-4 mt-3 py-2">
              Productivity
            </h2>
            <HiMiniArrowTrendingUp
              size={22}
              className="mt-6 mr-4 text-yellow-600"
            />
          </div>
          <p className="text-3xl font-bold ml-4">94%</p>
          <p className="text-xs text-green-500 ml-4 py-2">
            +5% from last month
          </p>
        </div>
      </div>
      <div className="border border-black/10 rounded-lg h-100 mt-5 ml-4 bg-white shadow-md hover:shadow-lg cursor-pointer">
        <h2 className="text-2xl font-semibold px-3 py-1 mt-1 ml-2">
          Recent Activity
        </h2>
        <p className="text-md text-gray-600 ml-5">
          Your latest email interactions
        </p>
        <div className="space-y-4">
          <div className="px-3 text-gray-500 mt-5">
            <div className="px-3">
              <div className="flex flex-row justify-between">
                <h3 className="text-md text-black font-semibold">
                  Email Drafted
                </h3>
                <p>2 min ago</p>
              </div>
              <p className="mb-2">Q4 Marketing Strategy</p>
              <hr className="text-gray-300 mb-4" />
            </div>
          </div>
          <div className="px-3 text-gray-500">
            <div className="px-3">
              <div className="flex flex-row justify-between">
                <h3 className="text-md text-black font-semibold">
                  Email Written
                </h3>
                <p>15 min ago</p>
              </div>
              <p className="mb-2">Client Proposal Follow-up</p>
              <hr className="text-gray-300 mb-4" />
            </div>
          </div>
          <div className="px-3 text-gray-500">
            <div className="px-3">
              <div className="flex flex-row justify-between">
                <h3 className="text-md text-black font-semibold">
                    Auto Reply Sent                 
                </h3>
                <p>1 hour ago</p>
              </div>
              <p className="mb-2">Meeting Request</p>
              <hr className="text-gray-300 mb-4" />
            </div>
          </div>
          <div className="px-3 text-gray-500">
            <div className="px-3">
              <div className="flex flex-row justify-between">
                <h3 className="text-md text-black font-semibold">
                  Email Summarized
                </h3>
                <p>2 hours ago</p>
              </div>
              <p className="mb-2">Weekly Team Update</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between mb-5">
        <div className="border border-black/10 rounded-lg w-92 h-30 mt-5 ml-4 p-3 bg-white shadow-md hover:shadow-lg cursor-pointer">
          <h2 className="font-semibold text-lg mb-5 mt-3 px-2">Draft New Mail</h2>
          <p className="px-2 text-gray-400 text-sm">Let AI help you craft the perfect email</p>
        </div>
        <div className="border border-black/10 rounded-lg w-92 h-30 mt-5 ml-4 p-3 bg-white shadow-md hover:shadow-lg cursor-pointer">
          <h2 className="font-semibold text-lg mb-5 mt-3 px-2">Rewrite Mail</h2>
          <p className="px-2 text-gray-400 text-sm">Improve tone, clarity and professionalism</p>
        </div>
        <div className="border border-black/10 rounded-lg w-92 h-30 mt-5 ml-4 p-3 bg-white shadow-md hover:shadow-lg cursor-pointer">
          <h2 className="font-semibold text-lg mb-5 mt-3 px-2">Summarize Mails</h2>
          <p className="px-2 text-gray-400 text-sm">Get quick summaries of long email threads</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
