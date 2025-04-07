import { check, DownloadEvent, Update } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';

enum UpdateType {
  // eslint-disable-next-line no-unused-vars
  Major = 'major',
  // eslint-disable-next-line no-unused-vars
  Minor = 'minor',
  // eslint-disable-next-line no-unused-vars
  Patch = 'patch',
  // eslint-disable-next-line no-unused-vars
  None = 'none',
}

interface Version {
  major: number;
  minor: number;
  patch: number;
}

/**
 * This function checks for the latest update and returns the update information if available.
 * @returns {Promise<Update | null>} The latest update information or null if no update is available.
 */
const getLatestUpdate = async (): Promise<Update | null> => {
  const update = await check();
  if (update) {
    console.log(
      `Found update ${update.version} from ${update.date} with notes: ${update.body}`,
    );
    return update;
  }
  return null;
};

/**
 * Parses a version string into its major, minor, and patch components.
 * @param {string} version - The version string to parse.
 * @returns {Version} An object containing the major, minor, and patch versions.
 */
const parseVersion = (version: string): Version => {
  const [major, minor, patch] = version.split('.').map(Number);
  return { major, minor, patch };
};

/**
 * Determines the type of update based on the current and new version strings.
 * @param {string} currentVersion - The current version of the application.
 * @param {string} newVersion - The new version of the application.
 * @returns {UpdateType} The type of update (major, minor, patch, or none).
 */
const determineUpdateType = (
  currentVersion: string,
  newVersion: string,
): UpdateType => {
  const current = parseVersion(currentVersion);
  const latest = parseVersion(newVersion);

  if (latest.major > current.major) {
    return UpdateType.Major;
  } else if (latest.minor > current.minor) {
    return UpdateType.Minor;
  } else if (latest.patch > current.patch) {
    return UpdateType.Patch;
  }
  return UpdateType.None;
};

/**
 * Downloads and installs a given update.
 * @param {Update} update - The update object containing the update information.
 * @param {(progress: DownloadEvent) => void} [progressCallback] - Optional callback for download progress.
 */
const downloadAndInstallUpdate = async (
  update: Update,
  // eslint-disable-next-line no-unused-vars
  progressCallback?: (progress: DownloadEvent) => void,
) => {
  let downloaded = 0;
  let contentLength = 0;

  await update.downloadAndInstall((progress: DownloadEvent) => {
    if (progressCallback) {
      progressCallback(progress);
    }
    switch (progress.event) {
      case 'Started':
        contentLength = progress.data.contentLength || 0;
        console.log(`Started downloading ${contentLength} bytes`);
        break;
      case 'Progress':
        downloaded += progress.data.chunkLength;
        console.log(`Downloaded ${downloaded} of ${contentLength}`);
        break;
      case 'Finished':
        console.log('Download finished');
        break;
    }
  });

  console.log('Update installed');
  await relaunch();
};

// const handleUpdate = async (currentVersion: string) => {
//   const update = await getLatestUpdate();
//   if (update) {
//     const updateType = determineUpdateType(currentVersion, update.version);

//     switch (updateType) {
//       case 'patch':
//         console.log('Patch update available. Suggesting update...');
//         // Implement optional update suggestion logic here
//         break;
//       case 'minor':
//       case 'major':
//         console.log(`${updateType} update available. Forcing update...`);
//         await downloadAndInstallUpdate(update);
//         break;
//       default:
//         console.log('No updates available');
//         break;
//     }
//   } else {
//     console.log('No updates available');
//   }
// };

export {
  UpdateType,
  getLatestUpdate,
  parseVersion,
  determineUpdateType,
  downloadAndInstallUpdate,
};
