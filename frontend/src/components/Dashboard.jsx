import { CiMail } from "react-icons/ci";
import { WiTime4 } from "react-icons/wi";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    emailsProcessed: 0,
    timeSaved: 0,
    autoReplies: 0,
    productivity: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load dashboard data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load metrics from emails data
      const emailsResponse = await fetch('http://localhost:8000/api/v1/emails');
      const emailsData = await emailsResponse.json();
      
      // Calculate metrics based on email data
      const processedCount = emailsData.processed_count;
      const totalEmails = emailsData.total;
      const autoReplyCount = emailsData.emails.filter(email => 
        email.metadata && email.metadata.auto_reply_generated
      ).length;
      
      const calculatedMetrics = {
        emailsProcessed: processedCount,
        timeSaved: processedCount * 5, // 5 minutes saved per email
        autoReplies: autoReplyCount,
        productivity: totalEmails > 0 ? Math.min(Math.round((processedCount / totalEmails) * 100), 100) : 0
      };
      
      setMetrics(calculatedMetrics);
      
      // Generate recent activity from processed emails
      const processedEmails = emailsData.emails.filter(email => email.status === 'processed');
      const activity = processedEmails.slice(0, 4).map((email, index) => {
        const activities = [
          {
            type: "Email Processed",
            description: email.subject,
            timeAgo: `${(index + 1) * 30} min ago`
          },
          {
            type: "Action Items Extracted",
            description: `${email.action_items?.length || 0} tasks identified`,
            timeAgo: `${(index + 1) * 45} min ago`
          },
          {
            type: "Auto Reply Generated",
            description: email.subject,
            timeAgo: `${(index + 1) * 60} min ago`
          },
          {
            type: "Email Categorized",
            description: `Tagged as ${email.tags?.[0] || 'General'}`,
            timeAgo: `${(index + 1) * 90} min ago`
          }
        ];
        return activities[index] || activities[0];
      });
      
      // If no processed emails, show default activities
      if (activity.length === 0) {
        setRecentActivity([
          {
            type: "Email Processed",
            description: "Q4 Marketing Strategy",
            timeAgo: "2 min ago"
          },
          {
            type: "Action Items Extracted", 
            description: "Client Proposal Follow-up",
            timeAgo: "15 min ago"
          },
          {
            type: "Auto Reply Generated",
            description: "Meeting Request",
            timeAgo: "1 hour ago"
          },
          {
            type: "Email Categorized",
            description: "Weekly Team Update",
            timeAgo: "2 hours ago"
          }
        ]);
      } else {
        setRecentActivity(activity);
      }
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Fallback to default data if API fails
      setMetrics({
        emailsProcessed: 247,
        timeSaved: 18.5,
        autoReplies: 89,
        productivity: 94
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    // Navigate to appropriate component based on action
    console.log(`Quick action: ${action}`);
    // You can add navigation logic here based on your routing setup
    // For example: navigateTo('/draft-email') etc.
  };

  return (
    <div className="px-3 mr-2">
      <h1 className="text-3xl font-bold px-4 py-2 mt-5">Dashboard</h1>
      <p className="px-4 text-md text-gray-600">
        Your AI email assistant overview
      </p>
      
      {/* Metrics Cards */}
      <div className="flex flex-row justify-between items-center space-x-3">
        {/* Emails Processed Card */}
        <div className="border border-black/10 rounded-lg w-68 h-34 mt-5 ml-4 bg-white shadow-md hover:shadow-lg cursor-pointer">
          <div className="flex flex-row justify-between">
            <h2 className="text-lg text-gray-600 px-4 mt-3 py-2">
              Emails Processed
            </h2>
            <CiMail size={22} className="mt-6 mr-4 text-blue-600" />
          </div>
          <p className="text-3xl font-bold ml-4">
            {isLoading ? "..." : metrics.emailsProcessed}
          </p>
          <p className="text-xs text-green-500 ml-4 py-2">
            +12% from last month
          </p>
        </div>

        {/* Time Saved Card */}
        <div className="border border-black/10 rounded-lg w-68 h-34 mt-5 ml-4 bg-white shadow-md hover:shadow-lg cursor-pointer">
          <div className="flex flex-row justify-between">
            <h2 className="text-lg text-gray-600 px-4 mt-3 py-2">Time Saved</h2>
            <WiTime4 size={22} className="mt-6 mr-4 text-green-500" />
          </div>
          <p className="text-3xl font-bold ml-4">
            {isLoading ? "..." : `${metrics.timeSaved}m`}
          </p>
          <p className="text-xs text-green-500 ml-4 py-2">
            +8% from last month
          </p>
        </div>

        {/* Auto Replies Card */}
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
          <p className="text-3xl font-bold ml-4">
            {isLoading ? "..." : metrics.autoReplies}
          </p>
          <p className="text-xs text-green-500 ml-4 py-2">
            +23% from last month
          </p>
        </div>

        {/* Productivity Card */}
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
          <p className="text-3xl font-bold ml-4">
            {isLoading ? "..." : `${metrics.productivity}%`}
          </p>
          <p className="text-xs text-green-500 ml-4 py-2">
            +5% from last month
          </p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="border border-black/10 rounded-lg h-100 mt-5 ml-4 bg-white shadow-md hover:shadow-lg cursor-pointer">
        <h2 className="text-2xl font-semibold px-3 py-1 mt-1 ml-2">
          Recent Activity
        </h2>
        <p className="text-md text-gray-600 ml-5">
          Your latest email interactions
        </p>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="px-3 text-gray-500 mt-5">
              <div className="px-3">
                <div className="flex flex-row justify-between">
                  <h3 className="text-md text-black font-semibold">
                    {activity.type}
                  </h3>
                  <p className="text-xs">{activity.timeAgo}</p>
                </div>
                <p className="mb-2">{activity.description}</p>
                {index < recentActivity.length - 1 && (
                  <hr className="text-gray-300 mb-4" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="flex flex-row justify-between mb-5">
        <div 
          className="border border-black/10 rounded-lg w-92 h-30 mt-5 ml-4 p-3 bg-white shadow-md hover:shadow-lg cursor-pointer"
          onClick={() => handleQuickAction('draft')}
        >
          <h2 className="font-semibold text-lg mb-5 mt-3 px-2">Draft New Mail</h2>
          <p className="px-2 text-gray-400 text-sm">Let AI help you craft the perfect email</p>
        </div>
        
        <div 
          className="border border-black/10 rounded-lg w-92 h-30 mt-5 ml-4 p-3 bg-white shadow-md hover:shadow-lg cursor-pointer"
          onClick={() => handleQuickAction('rewrite')}
        >
          <h2 className="font-semibold text-lg mb-5 mt-3 px-2">Rewrite Mail</h2>
          <p className="px-2 text-gray-400 text-sm">Improve tone, clarity and professionalism</p>
        </div>
        
        <div 
          className="border border-black/10 rounded-lg w-92 h-30 mt-5 ml-4 p-3 bg-white shadow-md hover:shadow-lg cursor-pointer"
          onClick={() => handleQuickAction('summarize')}
        >
          <h2 className="font-semibold text-lg mb-5 mt-3 px-2">Summarize Mails</h2>
          <p className="px-2 text-gray-400 text-sm">Get quick summaries of long email threads</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;