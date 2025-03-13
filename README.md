
# Church Management System (Desktop Version)

A comprehensive church management application that works as a desktop application, with local data storage using Node.js.

## Features

- ✨ Works offline as a desktop application
- 🖥️ Runs on Windows, macOS, and Linux
- 📱 Install as desktop app with shortcuts
- 🔄 Local database storage (no internet required)
- 🔒 Secure authentication
- 👥 Member management
- 📊 Attendance tracking
- 💰 Income management
- 📅 Event planning

## Installation Guide

### Standard Installation (For Users)

1. **Download the Installer**
   - Go to the Releases page and download the installer for your operating system:
     - Windows: `ChurchMate-Setup-1.0.0.exe`
     - macOS: `ChurchMate-1.0.0.dmg`
     - Linux: `ChurchMate-1.0.0.AppImage` or `churchmate_1.0.0_amd64.deb`

2. **Run the Installer**
   - Windows: Double-click the `.exe` file and follow the installation wizard
   - macOS: Open the `.dmg` file, drag the app to Applications
   - Linux: Make the AppImage executable and run it, or install the `.deb` package

3. **First-Time Setup**
   - The first time you run the application, it will create a local database
   - Default admin credentials:
     - Email: `admin@lfcc.com`
     - Password: `admin123`
   - You should change these credentials after first login

4. **Using the Application**
   - Launch ChurchMate from your desktop shortcut or Start Menu/Applications folder
   - Login with the admin credentials
   - Set up your church profile in the Settings page

### Database Location

The application stores all data locally on your computer. Database files are stored in:

- Windows: `%APPDATA%\ChurchMate\`
- macOS: `~/Library/Application Support/ChurchMate/`
- Linux: `~/.config/ChurchMate/`

Within this directory, database files are stored in the `db` folder, and uploaded files are stored in the `uploads` folder.

### Development Setup (For Developers)

1. **Clone the Repository**
   ```sh
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_FOLDER>
   ```

2. **Install Dependencies**
   ```sh
   npm install
   
   # Install additional required dependencies
   npm install --save-dev electron electron-builder concurrently cross-env wait-on
   ```

3. **Add Electron Scripts**
   ```sh
   # Run this script to add Electron scripts to package.json
   node electron-script.js
   
   # Install Electron dependencies
   cd electron
   npm install
   cd ..
   ```

4. **Run in Development Mode**
   ```sh
   # Start the Vite dev server and Electron
   npm run dev:electron
   ```

5. **Build for Production**
   ```sh
   # Build the Vite app
   npm run build:electron
   
   # Package with Electron
   npm run package
   
   # OR package for specific platform
   npm run package:windows
   npm run package:mac
   npm run package:linux
   ```

6. **Locate Installers**
   - The installers will be created in the `dist_electron` directory
   - Windows: `ChurchMate-Setup-1.0.0.exe`
   - macOS: `ChurchMate-1.0.0.dmg`
   - Linux: `ChurchMate-1.0.0.AppImage` or `churchmate_1.0.0_amd64.deb`

## Troubleshooting

**If the app isn't starting:**
1. Check if you have sufficient permissions on your computer
2. Try running as administrator (Windows) or with sudo (Linux)
3. Check the application logs at:
   - Windows: `%APPDATA%\ChurchMate\logs`
   - macOS: `~/Library/Logs/ChurchMate`
   - Linux: `~/.config/ChurchMate/logs`

**Missing electron script error:**
1. Make sure you've run `node electron-script.js` to add the required scripts to package.json
2. Verify you've installed all necessary dependencies:
   ```
   npm install --save-dev electron electron-builder concurrently cross-env wait-on
   ```
3. If the script fails to update package.json automatically, you can add the scripts manually:
   ```json
   "scripts": {
     "dev:electron": "concurrently -k \"cross-env NODE_ENV=development vite\" \"wait-on http://localhost:8080 && electron ./electron/main.js\"",
     "build:electron": "vite build",
     "package": "electron-builder -c electron-builder.yml",
     "package:windows": "electron-builder -c electron-builder.yml --win",
     "package:mac": "electron-builder -c electron-builder.yml --mac",
     "package:linux": "electron-builder -c electron-builder.yml --linux"
   }
   ```

**Cannot find module error:**
1. Ensure the path to the Electron main.js file is correct in your scripts
2. Make sure all required dependencies are installed
3. Check that all file paths in your code point to the correct locations
4. Run `cd electron && npm install && cd ..` to ensure all Electron dependencies are installed

**Data not saving:**
1. Ensure you have write permissions to the application data folder
2. Close and restart the application
3. Check disk space

## Technical Details

This desktop application uses:
- Electron for desktop app capabilities
- Vite + React for the frontend UI
- Express.js for local API server
- LowDB for local JSON database storage
- Node.js for backend processing
- TypeScript for type safety
- Tailwind CSS and shadcn-ui for styling

## Support

If you need help:
1. Check the troubleshooting section above
2. Contact your system administrator
3. File an issue on the project repository

## License

This project is protected by copyright law. All rights reserved.
