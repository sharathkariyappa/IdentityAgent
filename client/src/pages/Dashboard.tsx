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
  const [githubLinked, setGithubLinked] = useState(false);
  const [githubUser, setGithubUser] = useState<string | null>(null);

  const navigate = useNavigate();
  
  useEffect(() => {
    const storedUser = localStorage.getItem('githubUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setGithubUser(parsedUser.login || parsedUser.username); // adjust depending on your backend
      setGithubLinked(true);
    }
  }, []);
  const handleLinkGithub = () => {
    const client_id = import.meta.env.VITE_GITHUB_CLIENT_ID;
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=http://localhost:4000/api/github/callback`;
  };
  const saveProfile = () => {
    if (!role || !githubUser) {
      console.warn("Role or GitHub user is missing");
      return;
    }
  
    const profileData = {
      role,
      githubUser,
    };
  
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    console.log("Saved Profile:", profileData);
  };
  

  return (
    <>
      {isConnected ? (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Setup your Profile</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GitHub Profile Link
            </label>
            <button
              onClick={handleLinkGithub}
              className="mb-4 px-4 mr-4 py-2 bg-gray-800 text-white rounded"
            >
              {githubLinked ? 'GitHub Linked ✅' : 'Link GitHub'}
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select your role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">- Choose a role -</option>
              <option value="Investor">Investor</option>
              <option value="Founder">Founder</option>
              <option value="Contributor">Contributor</option>
            </select>
          </div>

          <button
            onClick={() => saveProfile()}
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
