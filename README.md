Project Name: Chatify
Project Description
ChatApp is a real-time messaging application built with React Native. The app allows users to enter their name, choose a background color for the chat interface, and start chatting with others in a simple and intuitive environment. It leverages React Navigation for seamless navigation between screens and Expo for building and testing the app.

Key Features:

User-friendly interface for starting a chat session
Background color customization
Real-time chat functionality (for further development)
How to Get the Project Running
Follow the steps below to set up and run the project locally on your machine.

1. Clone the repository
bash
Copy code
git clone [https://github.com/hostech83/Chatify)
2. Install Dependencies
In the project directory, install the dependencies using npm or yarn.

Using npm:

bash
Copy code
npm install
Using yarn:

bash
Copy code
npm start
This will open the Expo developer tools in your browser. You can then scan the QR code with the Expo Go app on your mobile device to view the app, or run the app in an Android or iOS simulator.

4. Ensure you have Expo Go installed
If you haven't already, install Expo Go on your mobile device from the App Store (iOS) or Google Play Store (Android).

Project Dependencies
React Native version: 0.66.x (Ensure you're using a compatible version of React Native for this project)
JavaScript version: ES6 (Modern JavaScript features are used, including arrow functions, destructuring, and async/await)
Expo SDK version: 44.x (Ensure you are using Expo SDK 44 or higher)
React Navigation: Used for managing navigation between screens
React Native Elements: UI component library for easy styling
ESLint: Ensures the code adheres to consistent style and best practices. The configuration is set to check for common JavaScript issues (including unused variables, missing semicolons, etc.).
ESLint Rules:
Enforces ES6 syntax and best practices.
Error on unused variables.
Warns on missing semicolons and extra spaces.
Enforces consistent indentation using 2 spaces.
To lint your code, run:

bash
Copy code
npm run lint
API the Project Uses
This project does not currently connect to an external API for chat functionality. The initial setup only allows the user to input their name and choose a background color for the chat screen.

However, the chat functionality can be extended by integrating a real-time messaging API like:

Firebase for real-time data synchronization
Socket.io for WebSocket-based communication
Example of possible API integration (future development):
If integrating with Firebase, you would need to:

Set up a Firebase project at Firebase Console
Install Firebase SDK:
bash
Copy code
npm install firebase
Configure Firebase in your app and replace dummy data with live real-time chat messages.
Contributing
Fork the repository.
Create a feature branch (git checkout -b feature-name).
Commit your changes (git commit -am 'Add new feature').
Push to the branch (git push origin feature-name).
Create a new Pull Request.
