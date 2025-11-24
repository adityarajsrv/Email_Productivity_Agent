/* eslint-disable react/prop-types */
import { AiOutlineAppstore } from "react-icons/ai";
import { TiPen } from "react-icons/ti";
import { FiRefreshCcw } from "react-icons/fi";
import { FiFileText } from "react-icons/fi";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { VscHistory } from "react-icons/vsc";
import { FiSettings } from "react-icons/fi";
import { RiBrainLine } from "react-icons/ri"; 

const Sidebar = ({ activeComponent, setActiveComponent }) => {
  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <AiOutlineAppstore size={28} /> },
    { key: 'promptbrain', label: 'Prompt Brain', icon: <RiBrainLine size={28} /> }, 
    { key: 'draft', label: 'Draft Email', icon: <TiPen size={28} /> },
    { key: 'rewrite', label: 'Rewrite', icon: <FiRefreshCcw size={28} /> },
    { key: 'summaries', label: 'Summaries', icon: <FiFileText size={28} /> },
    { key: 'autoreply', label: 'Auto-Reply', icon: <AiOutlineThunderbolt size={28} /> },
    { key: 'history', label: 'History', icon: <VscHistory size={28} /> },
    { key: 'settings', label: 'Settings', icon: <FiSettings size={28} /> },
  ];

  return (
    <div className="border-r h-screen w-2/11 border-gray-300 flex flex-col">
        <div className="flex flex-row justify-start items-center mb-1 mt-1">
            <img src="/logo.png" alt="Logo" className="h-16 w-16 m-2" />
            <h1 className="text-4xl text-[#ef2684]">Draft<span className="text-[#6d8afc]">Pilot</span></h1>
        </div>
        <hr className="text-gray-300"/>
        
        <div className="flex-1 space-y-3 mt-2 text-gray-600">
            {menuItems.map((item) => (
              <div 
                key={item.key}
                className={`flex flex-row justify-start items-center space-x-4 pl-4 py-3 hover:bg-purple-100 cursor-pointer ${
                  activeComponent === item.key ? 'bg-purple-100 border-r-4 border-purple-500' : ''
                }`}
                onClick={() => setActiveComponent(item.key)}
              >
                {item.icon}
                <span className="text-lg">{item.label}</span>
              </div>
            ))}
        </div>
        
        <div className="mt-auto">
            <hr className="text-gray-300"/>
            <div className="flex flex-row justify-start items-center space-x-4 pl-4 py-4">
                <h3 className="py-2.5 px-4 rounded-full bg-purple-500 text-white">U</h3>
                <div className="text-gray-600">
                    <h3 className="text-md font-medium">User</h3>
                    <p className="text-sm">user@email.com</p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Sidebar;