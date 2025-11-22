import Dashboard from "../components/Dashboard"
import Sidebar from "../components/Sidebar"

const Home = () => {
  return (
    <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-y-auto">
            <Dashboard />
        </div>
    </div>
  )
}

export default Home