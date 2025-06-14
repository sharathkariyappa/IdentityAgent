import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GithubCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const data = query.get('data');
    const code = query.get('code');
  
    if (data) {
      try {
        const user = JSON.parse(decodeURIComponent(data));
        console.log('GitHub user:', user);
        localStorage.setItem('githubUser', JSON.stringify(user));
        navigate('/dashboard');
      } catch (err) {
        console.error('Failed to parse GitHub user data:', err);
      }
    } else if (code) {
      // Only redirect if data is NOT already present
      console.log("No user data, redirecting to backend to fetch...");
      window.location.href = `http://localhost:4000/api/github/callback?code=${code}`;
    } else {
      console.error('GitHub callback error: No user data found.');
    }
  }, []);
  

  return <div>Linking GitHub account...</div>;
};

export default GithubCallback;
