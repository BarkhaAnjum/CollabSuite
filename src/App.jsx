// FULL UPDATED APP.JSX — PART 1 / 3
// Dark mode fixed, animations fixed, chatbot categories added.

import React, { useState, useEffect, useRef } from 'react';
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
  Pencil,
  Sun,
  Moon,
} from 'lucide-react';

import DocumentEditor from './DocumentEditor.jsx';
import VideoConference from './VideoConference.jsx';
import Whiteboard from './Whiteboard.jsx';
import TaskBoard from "./TaskBoard.jsx";

const RemoteCollabSuite = () => {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [username, setUsername] = useState('');
  const [theme, setTheme] = useState('light');

  // Dark mode logic (fixed)
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const [onlineUsers] = useState([
    { id: 1, name: 'Alice Chen', status: 'online' },
    { id: 2, name: 'Bob Smith', status: 'online' },
    { id: 3, name: 'Carol Davis', status: 'away' },
  ]);

  // LOGIN
  const handleLogin = () => {
    if (username.trim()) {
      setUser({ name: username, id: Date.now() });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full animate-fadeInUp">
          <div className="text-center mb-6">
            <Users className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">CollabSuite</h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Your Remote Work Hub</p>
          </div>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Enter your name"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-transform duration-150"
          >
            Enter Workspace
          </button>
        </div>
      </div>
    );
  }

  // DASHBOARD
  const Dashboard = () => (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
        Welcome back, {user.name}! 👋
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { name: 'Documents', icon: FileText, count: 12, color: 'blue', module: 'documents' },
          { name: 'Video Calls', icon: Video, count: 3, color: 'green', module: 'video' },
          { name: 'Tasks', icon: CheckSquare, count: 8, color: 'purple', module: 'tasks' },
          { name: 'Messages', icon: MessageSquare, count: 24, color: 'chat', module: 'chat' },
          { name: 'Whiteboard', icon: Pencil, count: 5, color: 'yellow', module: 'whiteboard' },
        ].map((item) => (
          <div
            key={item.name}
            onClick={() => setActiveModule(item.module)}
            className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-md transition cursor-pointer border-l-4 border-${item.color}-500 hover:scale-105 active:scale-95`}
          >
            <div className="flex items-center justify-between mb-4">
              <item.icon className={`w-8 h-8 text-${item.color}-600`} />
              <span className={`text-xl font-bold text-${item.color}-600`}>{item.count}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{item.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );

  // ------------------ TEAM CHAT ------------------
  const TeamChat = () => {
    const scrollRef = useRef(null);

    const [messages, setMessages] = useState([
      {
        id: 1,
        user: 'HelpBot',
        avatar: true,
        text:
          "Hello! I'm the CollabSuite Support Assistant. How may I assist you today?",
        time: '10:00 AM',
        suggestions: [
          'Reset Password',
          'Upload a File',
          'Payment Issue',
          'Permissions Guide',
          'Troubleshooting',
        ],
      },
    ]);

    const [botTyping, setBotTyping] = useState(false);
    const [memory, setMemory] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    // KNOWLEDGEBASE WILL START HERE (IN PART 2)…
    // ---------------------- KNOWLEDGE BASE (450+ LINES) ----------------------
    const knowledgeBase = {

      // 1️⃣ ACCOUNT & LOGIN (50)
      accountLogin: [
        "I can't log in","unable to log in","can't access my account","login not working",
        "login page stuck","app not letting me log in","site not accepting my credentials",
        "my password isn't working","wrong password","forgot password","reset password",
        "change password","password reset link not working","OTP isn't coming",
        "not receiving otp","otp delayed","otp failed","change phone number",
        "update mobile number","change email","update email","account locked",
        "account suspended","recover my account","delete my account","close account",
        "account blocked","session expired","logged out automatically",
        "keeps logging me out","verify phone","verify email",
        "verification failed","2FA not working","authentication failed",
        "details incorrect","username not accepted","cannot create password",
        "password not updating","reset link expired","cannot reset password",
        "not getting login email","sign-in button not working",
        "login page not loading","login keeps failing","unknown login error",
        "stuck during verification","system not recognizing account",
        "unusual activity detected","need help logging in"
      ],

      // 2️⃣ PAYMENT & BILLING (50)
      paymentBilling: [
        "my payment failed","payment not going through","transaction failed",
        "money deducted but not confirmed","amount deducted not updated","paid but still unpaid",
        "payment pending","payment stuck","processing payment error","view my invoice",
        "billing history","download invoice","invoice needed","update card",
        "update upi","change payment method","add card","delete card",
        "refund not received","refund kab milega","refund time","refund delayed",
        "wrong amount deducted","charged twice","double payment","charged multiple times",
        "unexpected charge","payment page not loading","upi not working",
        "card declined","bank declined","cannot complete payment",
        "upi issue","qr not scanning","transaction timeout","payment gateway down",
        "gst issue","invoice wrong","billing help","wrong charges",
        "cancel subscription","manage subscription","renewal failed",
        "auto debit failed","payment verification failed","update billing info",
        "payment security issue","invoice request"
      ],

      // 3️⃣ APP / SITE ERRORS (50)
      appErrors: [
        "app keeps crashing","app crashing","app closes automatically","freezing",
        "screen blank","white screen","black screen","nothing loading","loading forever",
        "page not loading","website not opening","error loading page","button not working",
        "buttons not responding","click not working","app unresponsive","site refreshing",
        "website stuck","error message","unknown error","something went wrong",
        "page crashed","reload not working","slow performance","lagging","throwing errors",
        "unexpected popup","features not loading","cannot open dashboard",
        "navigation not working","links broken","404 error","500 error","server down",
        "server not responding","maintenance issue","update failed","session expired",
        "logged out","cache issue","corrupted files","screen flickering",
        "UI distorted","layout broken","css not loading","script error",
        "app not updated properly","installation error","render issue"
      ],

      // 4️⃣ FEATURE USAGE (50)
      featureUsage: [
        "how do I upload files","where to upload","upload steps","upload document",
        "upload videos","cannot upload files","upload option missing","upload not working",
        "upload button missing","join video call","enter meeting","video call option",
        "join link not working","call join failed","screen share","screen share not working",
        "screen sharing missing","cannot share screen","find my projects",
        "see my projects","locate tasks","dashboard navigation","edit profile",
        "change profile name","change email profile","change phone profile",
        "upload profile picture","profile settings","create task","create project",
        "add collaborators","invite team","share access","edit shared file",
        "real time collaboration","whiteboard help","use whiteboard","open whiteboard",
        "video conference help","mute audio","turn off camera","record meeting",
        "record option missing","use chat","send messages","react to message",
        "download file","export file","feature not visible"
      ],

      // 5️⃣ CONNECTIVITY ISSUES (50)
      connectivityIssues: [
        "mic isn't working","mic not working","mic not detected","mic denied",
        "enable mic","camera not working","camera black","camera blocked",
        "allow camera","camera permission not showing","camera denied","call quality bad",
        "voice breaking","audio lagging","video lagging","network unstable",
        "internet slow","wifi issue","mobile data issue","upload stuck",
        "upload failing","upload retry","connection lost","disconnected from call",
        "call dropping","join call failed","internet error","unstable network",
        "no internet","slow network","bandwidth low","server high ping",
        "packet loss","audio not heard","video frozen","cannot hear participants",
        "others can't hear me","screen share lag","screen share disconnect",
        "echo issue","noise issue","wifi disconnecting","vpn issue",
        "network blocked","firewall issue","proxy issue","latency issue",
        "connection timeout"
      ],

      // 6️⃣ DEVICE & CONFIGURATION (50)
      deviceConfig: [
        "browser not supported","which browser","site not working on chrome",
        "site not working on safari","site not working on firefox","compatibility issue",
        "clear cache","clear browser data","cookie issue","enable cookies",
        "disable adblock","extensions blocking","camera blocked","mic blocked",
        "allow camera","allow mic","permission popup missing","blocked by settings",
        "storage full","low storage","phone not supported","old browser",
        "update browser","update app","app outdated","time incorrect",
        "security settings blocked","antivirus blocking","firewall blocking",
        "vpn causing issue","location blocked","bluetooth blocked",
        "screen recording blocked","camera used by another app","mic used by another app",
        "device overheating","device slow","background apps causing lag",
        "battery saver blocking","low ram","graphics issue","render issue",
        "audio device issue","camera device issue","need system requirements",
        "what devices supported","hardware acceleration issue","gpu issue"
      ],

      // 7️⃣ DATA & SYNC (50)
      dataSync: [
        "data isn't syncing","cannot sync","files not syncing","documents not updating",
        "real time sync failed","sync stuck 0%","sync pending","sync failed",
        "upload sync pending","sync across devices not working","data missing",
        "files disappeared","lost progress","not saved","autosave not working",
        "version not updated","old version showing","changes not showing",
        "others not seeing edits","shared file not updating","sync conflict",
        "duplicate versions","restore previous version","recover file",
        "revert changes","restore backup","backup not working","cloud sync failed",
        "network sync error","download stuck","download failed","preview not loading",
        "history missing","activity log missing","sync laptop phone issue",
        "data load issue","profile data missing","cannot fetch data","storage sync error",
        "cloud full","insufficient space","file overwritten","recover overwritten file",
        "metadata missing","incomplete file","cache sync issue","sync queue stuck"
      ],

      // 8️⃣ SECURITY & PRIVACY (50)
      securityPrivacy: [
        "is my data safe","app secure","privacy protected","account secure",
        "login alert","unknown device login","unauthorized login","suspicious login",
        "unusual activity","enable 2fa","two factor","otp login","secure account",
        "privacy settings","manage data","delete data","download data","data breach",
        "account hacked","password leaked","recover hacked account","report security issue",
        "report vulnerability","phishing","scam","logged out automatically",
        "session expires","token invalid","identity verify","data stored",
        "permissions required","how data handled","who can see profile",
        "security notification","privacy policy help","security settings failing",
        "blocked login","dangerous login attempt","device security warning",
        "email compromised","account takeover","threat detected","force logout",
        "security lock","freeze account","unlock account"
      ],

      // 9️⃣ GENERAL HELP (50)
      generalHelp: [
        "contact support","reach support","live chat","get help","how this works",
        "new here","guide me","need assistance","need help","explain steps",
        "get started","feature help","how app works","don’t understand",
        "confused","show me how","tutorial","help center","documentation",
        "instructions","what does this do","how to navigate","fix this issue",
        "who can help","what next","walkthrough","assist me","support email",
        "support number","complaint","feedback","report issue","escalate problem",
        "how long support takes","no response","faq page","need human support",
        "schedule call","raise ticket","ticket status","help section broken",
        "general inquiry","ask something","explain simple","what is procedure",
        "please guide"
      ]

    }; // END KNOWLEDGEBASE
// ------------------ FLOATING BOT (mini avatar bot) ------------------
const FloatingBot = () => {
  return (
    <div className="floating-mini-bot">
      <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
        B
      </div>
    </div>
  );
};


    // ---------------------- SMART BOT REPLY FUNCTION ----------------------
    function getBotReply(msg) {
      const text = msg.toLowerCase().trim();

      setMemory((prev) => [...prev.slice(-2), text]);

      // GREETINGS
      if (text === "hi" || text === "hello" || text === "hey" ||
        text.includes("good morning") || text.includes("good evening")) {
        return {
          text: "Hello! I'm here to assist you with anything you need. How may I help you today?",
          suggestions: ["Troubleshooting", "Account Help", "File Upload Help"]
        };
      }

      // CATEGORY MATCH FUNCTION
      const matches = (category) => knowledgeBase[category].some((q) => text.includes(q.split(" ")[0])
      );

      // CATEGORY RESPONSES
      if (matches("accountLogin")) {
        return {
          text: "I understand you're facing a login issue. Let’s go through a few steps that may help solve this.",
          steps: [
            "Ensure your email/phone is correct",
            "Try resetting password",
            "Check if OTP is delayed",
            "Ensure latest app version"
          ],
          suggestions: ["Reset Password", "OTP Help", "Account Recovery"]
        };
      }

      if (matches("paymentBilling")) {
        return {
          text: "It appears you're experiencing a payment or billing issue. Let me guide you through some solutions.",
          steps: [
            "Check if amount was deducted",
            "Wait 2–5 minutes for auto reversal",
            "Verify invoice details",
            "Ensure UPI/Card details are correct"
          ],
          suggestions: ["Refund Status", "Invoice Help", "Payment Method Update"]
        };
      }

      if (matches("appErrors")) {
        return {
          text: "Looks like you're facing an app or website issue. Try the following steps:",
          steps: [
            "Refresh or restart the app",
            "Clear cache and reload",
            "Try another browser",
            "Check network stability"
          ],
          suggestions: ["Clear Cache", "Browser Support", "App Not Loading"]
        };
      }

      if (matches("featureUsage")) {
        return {
          text: "Here's how to use this feature effectively:",
          steps: [
            "Go to the correct dashboard section",
            "Locate the feature button",
            "Follow prompts shown on screen",
            "Tell me if something doesn’t work"
          ],
          suggestions: ["Upload Guide", "Video Call Help", "Profile Settings"]
        };
      }

      if (matches("connectivityIssues")) {
        return {
          text: "Connectivity problems can be frustrating — let’s resolve this.",
          steps: [
            "Check mic/camera permissions",
            "Ensure no other app is using them",
            "Test your internet speed",
            "Refresh or restart the call"
          ],
          suggestions: ["Enable Permissions", "Network Help", "Mic/Camera Fix"]
        };
      }

      if (matches("deviceConfig")) {
        return {
          text: "It looks like there's a device or browser configuration issue.",
          steps: [
            "Clear cache & cookies",
            "Update your browser/app",
            "Allow permissions when prompted",
            "Disable blocking extensions"
          ],
          suggestions: ["Clear Cache", "Browser Help", "Allow Permissions"]
        };
      }

      if (matches("dataSync")) {
        return {
          text: "It seems your data isn't syncing properly. Try these steps:",
          steps: [
            "Check your network connection",
            "Refresh the page or app",
            "Ensure autosave is enabled",
            "Log out and log back in"
          ],
          suggestions: ["Sync Help", "Recover File", "Version History"]
        };
      }

      if (matches("securityPrivacy")) {
        return {
          text: "Your security matters. Let me help you with this.",
          steps: [
            "Review suspicious login alerts",
            "Enable two-factor authentication",
            "Reset password if needed",
            "Update recovery info"
          ],
          suggestions: ["Enable 2FA", "Reset Password", "Security Review"]
        };
      }

      if (matches("generalHelp")) {
        return {
          text: "I'm here to help! Tell me what you're trying to do.",
          suggestions: ["Open Support", "Contact Helpdesk", "How This Works"]
        };
      }

      // FALLBACK
      return {
        text: "Thank you for your message. Could you please share more details so I can assist you better?",
        suggestions: ["Troubleshooting", "Reset Password", "Upload Help"]
      };
    }
    // ---------------------- SEND MESSAGE ----------------------
    const sendMessage = () => {
      if (!newMessage.trim()) return;

      const userMsg = {
        id: Date.now(),
        user: user.name,
        text: newMessage,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setNewMessage("");
      setBotTyping(true);

      setTimeout(() => {
        const reply = getBotReply(userMsg.text);

        const botMsg = {
          id: Date.now() + 1,
          user: "HelpBot",
          avatar: true,
          text: reply.text,
          steps: reply.steps || [],
          suggestions: reply.suggestions || [],
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        setMessages((prev) => [...prev, botMsg]);
        setBotTyping(false);
      }, 800);
    };

    const handleSuggestionClick = (text) => {
      setNewMessage(text);
      setTimeout(() => sendMessage(), 150);
    };

    // AUTO SCROLL
    useEffect(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, [messages, botTyping]);

    // ---------------------- CHAT UI ----------------------
    return (
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col h-full animate-fadeIn">
      {/* FLOATING MINI BOT */}
<div className="floating-mini-bot">
  <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
    B
  </div>
</div>
        {/* CHAT HEADER */}
        <div className="border-b p-4 flex justify-between items-center dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Support Assistant
          </h2>

          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 transition duration-300 hover:scale-105 active:scale-95"
          >
            {theme === "light" ? <Moon /> : <Sun />}
          </button>
        </div>

        {/* MESSAGES */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.user === user.name ? "justify-end" : "justify-start"
              }`}
            >
              <div className="max-w-xs animate-fadeInUp">

                {/* BOT AVATAR */}
                {msg.avatar && msg.user !== user.name && (
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                      B
                    </div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      HelpBot
                    </span>
                  </div>
                )}

                {/* MESSAGE BUBBLE */}
                <div
                  className={`p-3 rounded-lg shadow ${
                    msg.user === user.name
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 dark:bg-gray-900 dark:text-gray-100"
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* STEPS */}
                  {msg.steps?.length > 0 && (
                    <ul className="mt-2 list-disc list-inside text-sm">
                      {msg.steps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  )}

                  {/* SUGGESTIONS */}
                  {msg.suggestions?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {msg.suggestions.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestionClick(s)}
                          className="bg-indigo-200 text-indigo-800 dark:bg-indigo-700 
                                     dark:text-indigo-100 px-2 py-1 text-xs rounded-full
                                     hover:scale-105 active:scale-95 transition-transform duration-150"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* TIME */}
                  <p
                    className={`text-xs mt-1 ${
                      msg.user === user.name
                        ? "text-indigo-200"
                        : "text-gray-500"
                    }`}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* BOT TYPING INDICATOR */}
          {botTyping && (
            <div className="flex justify-start animate-fadeInUp">
              <div className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm flex items-center gap-1">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounceDots"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounceDots [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounceDots [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
        </div>

        {/* INPUT BAR */}
        <div className="border-t p-4 dark:border-gray-700 flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message…"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg 
                       hover:bg-indigo-700 hover:scale-105 active:scale-95 
                       transition-transform duration-150"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };
  // ---------------------- MODULE ROUTING ----------------------
  const renderModule = () => {
    switch (activeModule) {
      case "dashboard":
        return <Dashboard />;
      case "documents":
        return <DocumentEditor onlineUsers={onlineUsers} />;
      case "video":
        return <VideoConference onlineUsers={onlineUsers} />;
      case "whiteboard":
        return <Whiteboard onlineUsers={onlineUsers} />;
      case "tasks":
        return <TaskBoard />;
      case "chat":
        return <TeamChat />;
      default:
        return <Dashboard />;
    }
  };

  // ---------------------- PAGE LAYOUT ----------------------
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">

      {/* SIDEBAR */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } bg-indigo-900 dark:bg-[#0d0d39] text-white transition-all duration-500 ease-in-out overflow-hidden`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold animate-fadeInUp">CollabSuite</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden hover:scale-110 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="space-y-2 animate-fadeInUp">
            {[
              { id: "dashboard", icon: Users, label: "Dashboard" },
              { id: "documents", icon: FileText, label: "Documents" },
              { id: "video", icon: Video, label: "Video Call" },
              { id: "whiteboard", icon: Pencil, label: "Whiteboard" },
              { id: "tasks", icon: CheckSquare, label: "Tasks" },
              { id: "chat", icon: MessageSquare, label: "Chat" },
].map((item) => (
  <button
    key={item.id}
    onClick={() => setActiveModule(item.id)}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition 
      hover:scale-105 active:scale-95 duration-150
      ${
        activeModule === item.id
          ? "bg-indigo-700"
          : "hover:bg-indigo-800"
      }`}
  >
    <item.icon className="w-5 h-5" />
    <span>{item.label}</span>
  </button>
))}
</nav>

{/* ONLINE USERS REMOVED */} 
</div>
</div>

{/* MAIN CONTENT WRAPPER */}
<div className="flex-1 flex flex-col overflow-hidden">

  {/* HEADER */}
  <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex items-center justify-between animate-fadeIn">
    <button
      onClick={() => setSidebarOpen(!sidebarOpen)}
      className="text-gray-600 dark:text-gray-300 hover:scale-110 transition-transform duration-150"
    >
      <Menu className="w-6 h-6" />
    </button>

    <div className="flex items-center gap-4">
      <span className="text-gray-700 dark:text-gray-200 font-medium animate-fadeInUp">
        {user.name}
      </span>

      <button
        onClick={() => setUser(null)}
        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200
                   rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105 active:scale-95 
                   transition-transform duration-150 flex items-center gap-2"
      >
        <LogOut className="w-4 h-4" /> Logout
      </button>
    </div>
  </header>

  {/* PAGE CONTENT */}
  <main className="flex-1 overflow-y-auto p-6 animate-fadeInUp">
    {renderModule()}
  </main>

</div>

    </div>
  );
};

export default RemoteCollabSuite;
