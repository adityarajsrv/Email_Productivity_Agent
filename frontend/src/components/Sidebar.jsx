import { AiOutlineAppstore } from "react-icons/ai";
import { TiPen } from "react-icons/ti";
import { FiRefreshCcw } from "react-icons/fi";
import { FiFileText } from "react-icons/fi";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { VscHistory } from "react-icons/vsc";
import { FiSettings } from "react-icons/fi";

const Sidebar = () => {
  return (
    <div className="border-r h-screen w-2/11 border-gray-300 flex flex-col">
        <div className="flex flex-row justify-start items-center mb-1 mt-1">
            <img src="/logo.png" alt="Logo" className="h-16 w-16 m-2" />
            <h1 className="text-4xl text-[#ef2684]">Draft<span className="text-[#6d8afc]">Pilot</span></h1>
        </div>
        <hr className="text-gray-300"/>
        <div className="flex-1 space-y-3 mt-2 text-gray-600">
            <div className="flex flex-row justify-start items-center space-x-4 pl-4 py-3 hover:bg-purple-100 cursor-pointer">
                <AiOutlineAppstore size={28} />
                <span className="text-lg">Dashboard</span>
            </div>
            <div className="flex flex-row justify-start items-center space-x-4 pl-4 py-3 hover:bg-purple-100 cursor-pointer">
                <TiPen size={28} />
                <span className="text-lg">Draft Email</span>
            </div>
            <div className="flex flex-row justify-start items-center space-x-4 pl-4 py-3 hover:bg-purple-100 cursor-pointer">
                <FiRefreshCcw size={28} />
                <span className="text-lg">Rewrite</span>
            </div>
            <div className="flex flex-row justify-start items-center space-x-4 pl-4 py-3 hover:bg-purple-100 cursor-pointer">
                <FiFileText size={28} />
                <span className="text-lg">Summaries</span>
            </div>
            <div className="flex flex-row justify-start items-center space-x-4 pl-4 py-3 hover:bg-purple-100 cursor-pointer">
                <AiOutlineThunderbolt size={28} />
                <span className="text-lg">Auto-Reply</span>
            </div>
            <div className="flex flex-row justify-start items-center space-x-4 pl-4 py-3 hover:bg-purple-100 cursor-pointer">
                <VscHistory size={28} />
                <span className="text-lg">History</span>
            </div>
            <div className="flex flex-row justify-start items-center space-x-4 pl-4 py-3 hover:bg-purple-100 cursor-pointer">
                <FiSettings size={28}/>
                <span className="text-lg">Settings</span>
            </div>
        </div>
        <hr className="text-gray-300 mt-30"/>
        <div className="flex flex-row justify-start items-center space-x-4 pl-4 py-4">
            <h3 className="py-2.5 px-4 rounded-full bg-purple-500">U</h3>
            <div className="text-gray-600">
                <h3 className="text-md font-medium">User</h3>
                <p className="text-sm">user@email.com</p>
            </div>
        </div>
    </div>
  )
}

export default Sidebar