import { useState } from 'react';
import Sidebar from "../components/Sidebar"
import Dashboard from "../components/Dashboard"
import DraftEmail from "../components/DraftEmail"
import Rewrite from "../components/Rewrite"
import Summaries from "../components/Summaries"
import AutoReply from "../components/AutoReply"
import History from "../components/History"
import Settings from "../components/Settings"

const Home = () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'dashboard':
        return <Dashboard />;
      case 'draft':
        return <DraftEmail />;
      case 'rewrite':
        return <Rewrite />;
      case 'summaries':
        return <Summaries />;
      case 'autoreply':
        return <AutoReply />;
      case 'history':
        return <History />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen">
        <Sidebar 
          activeComponent={activeComponent} 
          setActiveComponent={setActiveComponent} 
        />
        <div className="flex-1 overflow-y-auto">
            {renderComponent()}
        </div>
    </div>
  );
};

export default Home;