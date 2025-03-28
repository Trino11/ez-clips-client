import { useEffect, useRef, useState } from 'react';
import {
  determineUpdateType,
  downloadAndInstallUpdate,
  getLatestUpdate,
  UpdateType,
} from './UpdateHandler';
import { getVersion } from '@tauri-apps/api/app';
import { Update } from '@tauri-apps/plugin-updater';
import './UpdateModal.css';

function UpdateModal() {
  const [updateType, setUpdateType] = useState<UpdateType>(UpdateType.None);
  const [latestUpdate, setLatestUpdate] = useState<Update | null>(null);

  const [updateRejected, setUpdateRejected] = useState(false);

  const [downloadProgress, setDownloadProgress] = useState(0);

  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    // Check for updates when the app loads
    const checkForUpdates = async () => {
      const latestUpdate = await getLatestUpdate();
      const currentVersion = await getVersion();
      if (latestUpdate) {
        const updateType = determineUpdateType(
          currentVersion,
          latestUpdate.version,
        );
        setUpdateType(updateType);
        console.log(`Update type: ${updateType}`);

        if (updateType !== UpdateType.None) {
          console.log(`New version available: ${latestUpdate.version}`);
          setLatestUpdate(latestUpdate);
        } else {
          console.log('No new updates available.');
        }
      } else {
        console.log(`No updates found, current version is ${currentVersion}`);
      }
    };

    checkForUpdates();
  }, []);

  return (
    <dialog
      className="update-notification"
      open={latestUpdate !== null && !updateRejected}
    >
      <p>Update available! New version: {latestUpdate?.version}</p>
      <p>Would you like to update now?</p>
      <button
        onClick={async () => {
          if (latestUpdate) {
            let downloaded = 0;
            let contentLength = 0;

            await downloadAndInstallUpdate(latestUpdate, (progress) => {
              switch (progress.event) {
                case 'Started':
                  contentLength = progress.data.contentLength || 0;
                  setDownloadProgress(-1);
                  break;
                case 'Progress':
                  downloaded += progress.data.chunkLength;
                  setDownloadProgress((downloaded / contentLength) * 100);
                  break;
                case 'Finished':
                  setDownloadProgress(101);
                  break;
              }
            });
            // window.location.reload();
          }
        }}
      >
        Update Now
      </button>
      {updateType === UpdateType.Patch && (
        <button
          onClick={() => {
            setUpdateRejected(true);
          }}
        >
          Later
        </button>
      )}
      {downloadProgress === -1 && (
        <progress value={0} max={100}>
          Starting download...
        </progress>
      )}
      {downloadProgress > 0 && downloadProgress < 100 && (
        <progress value={downloadProgress} max={100}>
          {downloadProgress}%
        </progress>
      )}
      {downloadProgress >= 100 && (
        <progress value={100} max={100}>
          Download complete! Restarting...
        </progress>
      )}
    </dialog>
  );
}

export default UpdateModal;
