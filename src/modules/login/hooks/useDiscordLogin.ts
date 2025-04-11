import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { openUrl } from '@tauri-apps/plugin-opener';
import { useEffect, useState } from 'react';

export const useDiscordLogin = () => {
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  const LOCAL_AUTH_BACKEND_URL = 'http://localhost:5173';
  const wantToUseLocalAuthBackend = window.__TAURI_INTERNALS__ && false;

  const openDiscordLogin = async () => {
    const redirect_url = `${import.meta.env.VITE_API_URL}/auth/discord?redirect_uri=${encodeURIComponent(
      wantToUseLocalAuthBackend
        ? LOCAL_AUTH_BACKEND_URL
        : `${import.meta.env.VITE_API_URL}/auth/discord/callback`,
    )}`;
    if (wantToUseLocalAuthBackend) {
      // Start the OAuth server
      await invoke('start_oauth_server');

      // Open the Discord OAuth2 login page
      openUrl(redirect_url);
    } else {
      // Fallback for non-TAURI environments
      const currentUrl = new URL(window.location.href);
      const callbackUrl = `${currentUrl.origin}/login/callback`;
      window.location.href = `${redirect_url}&return_to=${encodeURIComponent(callbackUrl)}`;
    }
  };

  useEffect(() => {
    if (!wantToUseLocalAuthBackend) return;

    const unlisten = listen<string>('discord_oauth_code', async (event) => {
      const code = event.payload;
      const redirect_uri = window.__TAURI_INTERNALS__
        ? LOCAL_AUTH_BACKEND_URL
        : `${import.meta.env.VITE_API_URL}/auth/discord/callback`;

      const state = { redirect_uri };
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/discord/callback?code=${code}&state=${encodeURIComponent(JSON.stringify(state))}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (!res.ok) {
        console.error('Error fetching JWT:', res.statusText);
        return;
      }

      const data = await res.json();
      setJwtToken(data.jwt);
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  return { openDiscordLogin, jwtToken };
};
