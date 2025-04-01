
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Directories to be cleared
const dirsToClean = [
  'dist_electron',
  'dist_electron_build'
];

// Function to delete a directory recursively
function deleteFolderRecursive(directoryPath) {
  if (fs.existsSync(directoryPath)) {
    console.log(`Attempting to delete directory: ${directoryPath}`);
    
    // On Windows, use 'rimraf' command which can handle locked files better
    if (process.platform === 'win32') {
      try {
        // Use 'rm -rf' style command that works on Windows
        exec(`rmdir /s /q "${directoryPath}"`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error deleting directory ${directoryPath}:`, error);
          } else {
            console.log(`Successfully deleted directory: ${directoryPath}`);
          }
        });
      } catch (err) {
        console.error(`Failed to execute rmdir command for ${directoryPath}:`, err);
      }
    } else {
      // For non-Windows platforms, use native fs methods
      try {
        fs.rmSync(directoryPath, { recursive: true, force: true });
        console.log(`Successfully deleted directory: ${directoryPath}`);
      } catch (err) {
        console.error(`Error deleting directory ${directoryPath}:`, err);
      }
    }
  } else {
    console.log(`Directory doesn't exist, skipping: ${directoryPath}`);
  }
}

// Clean all directories
console.log("Cleaning build directories...");
dirsToClean.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  deleteFolderRecursive(fullPath);
});

// Create a small delay to ensure commands have time to complete
setTimeout(() => {
  console.log("Clean-up process completed.");
}, 1000);
