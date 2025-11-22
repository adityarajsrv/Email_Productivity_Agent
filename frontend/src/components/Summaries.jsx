import { SlClock } from "react-icons/sl";
import { FiFileText, FiUser } from "react-icons/fi";

const Summaries = () => {
  return (
    <div className="px-6 py-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Email Summaries</h1>
        <p className="text-lg text-gray-600 mt-2">
          AI-generated summaries of your emails
        </p>
      </div>
      <div className="border border-black/10 rounded-lg w-full h-48 mt-5 px-6 py-4 bg-white shadow-md hover:shadow-lg cursor-pointer">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row justify-start space-x-3">
            <h3 className="text-lg font-semibold">Q4 Marketing Strategy</h3>
            <p className="text-xs border border-red-600 rounded-2xl px-4 py-1 text-white bg-red-500">
              high
            </p>
          </div>
          <FiFileText size={20} color="blue"/>
        </div>
        <div className="flex flex-row justify-start space-x-4">
          <div className="mt-2 flex flex-row justify-start space-x-2">
            <div className="flex flex-row justify-start space-x-1.5 text-sm text-gray-500">
              <FiUser size={16} className="mt-0.5" />
              <p>Sarah Johnson</p>
            </div>
          </div>
          <div className="mt-2 flex flex-row justify-start space-x-2">
            <div className="flex flex-row justify-start space-x-1.5 text-sm text-gray-500">
              <SlClock size={16} className="mt-0.5" />
              <p>2024-01-15</p>
            </div>
          </div>
        </div>
        <p className="py-3 mt-2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam expedita
          soluta cum exercitationem rem! Neque id quasi odit aliquid, doloremque
          quod voluptate, laboriosam accusamus deleniti autem error tempore,
          dolorem inventore?
        </p>
        <div className="flex flex-row justify-between">
          <div className="flex flex-row justify-start space-x-3">
            <p className="text-xs border border-gray-400 rounded-2xl px-3 py-1 text-black font-semibold">
              Marketing
            </p>
            <p className="text-xs border border-gray-400 rounded-2xl px-3 py-1 text-black font-semibold">
              Strategy
            </p>
          </div>
          <button className="font-semibold">View Original</button>
        </div>
      </div>
      <div className="border border-black/10 rounded-lg w-full h-48 mt-5 px-6 py-4 bg-white shadow-md hover:shadow-lg cursor-pointer">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row justify-start space-x-3">
            <h3 className="text-lg font-semibold">Q4 Marketing Strategy</h3>
            <p className="text-xs border border-red-600 rounded-2xl px-4 py-1 text-white bg-red-500">
              high
            </p>
          </div>
          <FiFileText size={20} color="blue"/>
        </div>
        <div className="flex flex-row justify-start space-x-4">
          <div className="mt-2 flex flex-row justify-start space-x-2">
            <div className="flex flex-row justify-start space-x-1.5 text-sm text-gray-500">
              <FiUser size={16} className="mt-0.5" />
              <p>Sarah Johnson</p>
            </div>
          </div>
          <div className="mt-2 flex flex-row justify-start space-x-2">
            <div className="flex flex-row justify-start space-x-1.5 text-sm text-gray-500">
              <SlClock size={16} className="mt-0.5" />
              <p>2024-01-15</p>
            </div>
          </div>
        </div>
        <p className="py-3 mt-2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam expedita
          soluta cum exercitationem rem! Neque id quasi odit aliquid, doloremque
          quod voluptate, laboriosam accusamus deleniti autem error tempore,
          dolorem inventore?
        </p>
        <div className="flex flex-row justify-between">
          <div className="flex flex-row justify-start space-x-3">
            <p className="text-xs border border-gray-400 rounded-2xl px-3 py-1 text-black font-semibold">
              Marketing
            </p>
            <p className="text-xs border border-gray-400 rounded-2xl px-3 py-1 text-black font-semibold">
              Strategy
            </p>
          </div>
          <button className="font-semibold">View Original</button>
        </div>
      </div>
      <div className="border border-black/10 rounded-lg w-full h-48 mt-5 px-6 py-4 bg-white shadow-md hover:shadow-lg cursor-pointer">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row justify-start space-x-3">
            <h3 className="text-lg font-semibold">Q4 Marketing Strategy</h3>
            <p className="text-xs border border-red-600 rounded-2xl px-4 py-1 text-white bg-red-500">
              high
            </p>
          </div>
          <FiFileText size={20} color="blue"/>
        </div>
        <div className="flex flex-row justify-start space-x-4">
          <div className="mt-2 flex flex-row justify-start space-x-2">
            <div className="flex flex-row justify-start space-x-1.5 text-sm text-gray-500">
              <FiUser size={16} className="mt-0.5" />
              <p>Sarah Johnson</p>
            </div>
          </div>
          <div className="mt-2 flex flex-row justify-start space-x-2">
            <div className="flex flex-row justify-start space-x-1.5 text-sm text-gray-500">
              <SlClock size={16} className="mt-0.5" />
              <p>2024-01-15</p>
            </div>
          </div>
        </div>
        <p className="py-3 mt-2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam expedita
          soluta cum exercitationem rem! Neque id quasi odit aliquid, doloremque
          quod voluptate, laboriosam accusamus deleniti autem error tempore,
          dolorem inventore?
        </p>
        <div className="flex flex-row justify-between">
          <div className="flex flex-row justify-start space-x-3">
            <p className="text-xs border border-gray-400 rounded-2xl px-3 py-1 text-black font-semibold">
              Marketing
            </p>
            <p className="text-xs border border-gray-400 rounded-2xl px-3 py-1 text-black font-semibold">
              Strategy
            </p>
          </div>
          <button className="font-semibold">View Original</button>
        </div>
      </div>
      <div className="border border-black/10 rounded-lg w-full h-48 mt-5 px-6 py-4 bg-white shadow-md hover:shadow-lg cursor-pointer">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row justify-start space-x-3">
            <h3 className="text-lg font-semibold">Q4 Marketing Strategy</h3>
            <p className="text-xs border border-red-600 rounded-2xl px-4 py-1 text-white bg-red-500">
              high
            </p>
          </div>
          <FiFileText size={20} color="blue"/>
        </div>
        <div className="flex flex-row justify-start space-x-4">
          <div className="mt-2 flex flex-row justify-start space-x-2">
            <div className="flex flex-row justify-start space-x-1.5 text-sm text-gray-500">
              <FiUser size={16} className="mt-0.5" />
              <p>Sarah Johnson</p>
            </div>
          </div>
          <div className="mt-2 flex flex-row justify-start space-x-2">
            <div className="flex flex-row justify-start space-x-1.5 text-sm text-gray-500">
              <SlClock size={16} className="mt-0.5" />
              <p>2024-01-15</p>
            </div>
          </div>
        </div>
        <p className="py-3 mt-2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam expedita
          soluta cum exercitationem rem! Neque id quasi odit aliquid, doloremque
          quod voluptate, laboriosam accusamus deleniti autem error tempore,
          dolorem inventore?
        </p>
        <div className="flex flex-row justify-between">
          <div className="flex flex-row justify-start space-x-3">
            <p className="text-xs border border-gray-400 rounded-2xl px-3 py-1 text-black font-semibold">
              Marketing
            </p>
            <p className="text-xs border border-gray-400 rounded-2xl px-3 py-1 text-black font-semibold">
              Strategy
            </p>
          </div>
          <button className="font-semibold">View Original</button>
        </div>
      </div>
    </div>
  );
};

export default Summaries;
