import { useEffect, useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { data: walletClient } = useWalletClient();
  const { address, isConnected } = useAccount();
  const [did, setDid] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string>('');
  const [githubLink, setGithubLink] = useState<string>('');

  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!isConnected) {
  //     navigate('/');
  //   }
  // }, [isConnected, navigate]);

  const fetchWeeklyGitHubStats = async (username: string) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
    const res = await fetch(`https://api.github.com/users/${username}/events/public`);
    const events = await res.json();
  
    let commits = 0;
    let pullRequests = 0;
    let issues = 0;
  
    events.forEach((event: any) => {
      const eventDate = new Date(event.created_at);
      if (eventDate >= oneWeekAgo) {
        switch (event.type) {
          case "PushEvent":
            commits += event.payload.commits?.length || 0;
            break;
          case "PullRequestEvent":
            pullRequests++;
            break;
          case "IssuesEvent":
            issues++;
            break;
        }
      }
    });
  
    return { commits, pullRequests, issues };
  };
  
  const getUsernameFromGitHubUrl = (url: string) => {
    try {
      const pathname = new URL(url).pathname; // /yourusername
      return pathname.replace('/', '');       // yourusername
    } catch (error) {
      console.error("Invalid GitHub URL");
      return null;
    }
  };
  
  const handleSubmit = async (url: string) => {
    const username = getUsernameFromGitHubUrl(url);
    if (!username) return;
  
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      const data = await response.json();
      console.log("GitHub Profile Data:", data);
    } catch (error) {
      console.error("Failed to fetch GitHub profile data", error);
    }
  
    try {
      const githubStats = await fetchWeeklyGitHubStats(username);  // ✅ await here
      console.log("GitHub Weekly Stats:", githubStats);
    } catch (error) {
      console.error("Error fetching GitHub stats", error);
    }
  };
  
  

  return (
    <>
      {isConnected ? (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Setup your Profile</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select your role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">-- Choose a role --</option>
              <option value="agent">Investor</option>
              <option value="client">Founder</option>
              <option value="developer">Contributor</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GitHub Profile Link
            </label>
            <input
              type="url"
              placeholder="https://github.com/yourusername"
              value={githubLink}
              onChange={(e) => setGithubLink(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <button
            onClick={() => handleSubmit(githubLink)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Profile
          </button>
        </div>
      ) : (
        <div className="p-4 text-center">
          <h1 className="text-xl font-bold mb-2">Welcome to DAgent</h1>
          <p className="text-sm text-gray-700">
            You haven’t connected your wallet yet. Please connect your wallet to proceed.
          </p>
        </div>
      )}
    </>
  );
}
