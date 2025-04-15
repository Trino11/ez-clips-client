import { useEffect } from 'react';
import { useDiscordLogin } from '../hooks/useDiscordLogin';

const LoginWithDiscord = () => {
  const { openDiscordLogin, jwtToken } = useDiscordLogin();

  const handleLogin = () => {
    openDiscordLogin();
  };

  useEffect(() => {
    if (jwtToken) {
      console.log('JWT Token:', jwtToken);
    }
  }, [jwtToken]);

  return jwtToken === null ? (
    <button className="w-full" onClick={handleLogin}>
      <div className="flex items-center gap-2">
        <img
          src="/images/discord-logo.svg"
          alt="Discord Logo"
          className="w-5 h-5"
        />
        Login with Discord
      </div>
    </button>
  ) : (
    <div className="flex justify-center items-center w-full h-full">
      <p>You are logged in</p>
      <p>JWT: {jwtToken}</p>
    </div>
  );
};

export default LoginWithDiscord;
