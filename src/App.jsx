import React, { useState } from 'react';
import {
  Video,
  MessageSquare,
  CheckSquare,
  FileText,
  Users,
  LogOut,
  Menu,
  X,
  Send,
  Plus,
  Pencil,
} from 'lucide-react';

import DocumentEditor from './DocumentEditor.jsx';
import VideoConference from './VideoConference.jsx';
import Whiteboard from './Whiteboard.jsx';

const RemoteCollabSuite = () => {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [username, setUsername] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([
    { id: 1, name: 'Alice Chen', status: 'online' },
    { id: 2, name: 'Bob Smith', status: 'online' },
    { id: 3, name: 'Carol Davis', status: 'away' },
  ]);

  // Login handler
  const handleLogin = () => {
    if (username.trim()) {
      setUser({ name: username, id: Date.now() });
    }
  };

  // Login Screen
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">CollabSuite</h1>
            <p className="text-gray-600">Your Remote Work Hub</p>
          </div>
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Enter Workspace
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Module Components
  const Dashboard = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}! 👋</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: 'Documents', icon: FileText, count: 12, color: 'blue', module: 'documents' },
          { name: 'Video Calls', icon: Video, count: 3, color: 'green', module: 'video' },
          { name: 'Tasks', icon: CheckSquare, count: 8, color: 'purple', module: 'tasks' },
          { name: 'Messages', icon: MessageSquare, count: 24, color: 'pink', module: 'chat' },
          // ✅ New Whiteboard card
          { name: 'Whiteboard', icon: Pencil, count: 5, color: 'yellow', module: 'whiteboard' },
        ].map((item) => (
          <div
            key={item.name}
            onClick={() => setActiveModule(item.module)}
            className={`bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer border-l-4 border-${item.color}-500`}
          >
            <div className="flex items-center justify-between mb-4">
              <item.icon className={`w-8 h-8 text-${item.color}-600`} />
              <span className={`text-2xl font-bold text-${item.color}-600`}>{item.count}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700">{item.name}</h3>
          </div>
        ))}
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { user: 'Alice Chen', action: 'edited "Q4 Strategy Doc"', time: '5 min ago' },
            { user: 'Bob Smith', action: 'completed task "Update API"', time: '12 min ago' },
            { user: 'Carol Davis', action: 'started video call', time: '23 min ago' },
          ].map((activity, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
              <div>
                <span className="font-semibold text-gray-900">{activity.user}</span>
                <span className="text-gray-600"> {activity.action}</span>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const TaskBoard = () => {
    const [tasks, setTasks] = useState({
      todo: [{ id: 1, title: 'Design landing page', assignee: 'Alice' }],
      progress: [{ id: 2, title: 'Build API endpoints', assignee: 'Bob' }],
      done: [{ id: 3, title: 'Setup database', assignee: 'Carol' }],
    });

    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Task Board</h2>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Task
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['todo', 'progress', 'done'].map((col) => (
            <div key={col} className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-4 text-gray-700 uppercase text-sm">
                {col === 'todo' ? 'To Do' : col === 'progress' ? 'In Progress' : 'Done'}
              </h3>
              <div className="space-y-3">
                {tasks[col].map((task) => (
                  <div key={task.id} className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="font-medium text-gray-900">{task.title}</p>
                    <p className="text-sm text-gray-600 mt-1">👤 {task.assignee}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const TeamChat = () => {
    const [messages, setMessages] = useState([
      { id: 1, user: 'Alice Chen', text: 'Hey team! Ready for standup?', time: '10:30 AM' },
      { id: 2, user: 'Bob Smith', text: 'Yes! Just finishing up the API', time: '10:32 AM' },
    ]);
    const [newMessage, setNewMessage] = useState('');

    const sendMessage = () => {
      if (newMessage.trim()) {
        setMessages([
          ...messages,
          {
            id: Date.now(),
            user: user.name,
            text: newMessage,
            time: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          },
        ]);
        setNewMessage('');
      }
    };

    return (
      <div className="bg-white rounded-xl shadow-sm flex flex-col h-full">
        <div className="border-b p-4">
          <h2 className="text-xl font-bold">Team Chat</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.user === user.name ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs ${
                  msg.user === user.name
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                } rounded-lg p-3`}
              >
                {msg.user !== user.name && (
                  <p className="text-xs font-semibold mb-1">{msg.user}</p>
                )}
                <p>{msg.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.user === user.name ? 'text-indigo-200' : 'text-gray-500'
                  }`}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t p-4 flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'documents':
        return <DocumentEditor onlineUsers={onlineUsers} />;
      case 'video':
        return <VideoConference onlineUsers={onlineUsers} />;
      case 'whiteboard': // ✅ new route
        return <Whiteboard onlineUsers={onlineUsers} />;
      case 'tasks':
        return <TaskBoard />;
      case 'chat':
        return <TeamChat />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-indigo-900 text-white transition-all duration-300 overflow-hidden`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">CollabSuite</h1>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="space-y-2">
            {[
              { id: 'dashboard', icon: Users, label: 'Dashboard' },
              { id: 'documents', icon: FileText, label: 'Documents' },
              { id: 'video', icon: Video, label: 'Video Call' },
              // ✅ Whiteboard in sidebar
              { id: 'whiteboard', icon: Pencil, label: 'Whiteboard' },
              { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
              { id: 'chat', icon: MessageSquare, label: 'Chat' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeModule === item.id ? 'bg-indigo-700' : 'hover:bg-indigo-800'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="mt-8 pt-8 border-t border-indigo-800">
            <h3 className="text-sm font-semibold mb-3 text-indigo-300">Online Users</h3>
            {onlineUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-2 mb-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    u.status === 'online' ? 'bg-green-400' : 'bg-yellow-400'
                  }`}
                />
                <span className="text-sm">{u.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">{user.name}</span>
            <button
              onClick={() => setUser(null)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </header>

        {/* Module Content */}
        <main className="flex-1 overflow-y-auto p-6">{renderModule()}</main>
      </div>
    </div>
  );
};

export default RemoteCollabSuite;
