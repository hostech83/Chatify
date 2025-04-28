# Welcome to Chatify!

Chatify is your go-to mobile chat app, enabling users to send messages, share images, and broadcast their location with ease.

# Project Name: Chatify

Project Description
ChatApp is a real-time messaging application built with React Native. The app allows users to enter their name, choose a background color for the chat interface, and start chatting with others in a simple and intuitive environment. It leverages React Navigation for seamless navigation between screens and Expo for building and testing the app.

# Key Features:

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

# Using npm:

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

# Project Dependencies

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

# Table of Contents

Features
Technical Requirements
Getting Started
Running the Application
Troubleshooting
Dependencies
Dev Dependencies
Project Structure
Contributing
License
Features
User Stories
User Story 1: Chat Room Entry
As a new user, I want to enter a chat room easily so I can start chatting quickly.

gherkin
Copy code
Feature: Chat Room Entry  
 Scenario: Entering a chat room  
 Given I am a new user  
 When I open the app  
 Then I should see a field to enter my name and select a background color  
 And I should be able to join the chat room with minimal effort  
User Story 2: Send Messages
As a user, I want to send messages to my friends so I can communicate effectively.

gherkin
Copy code
Feature: Send Messages  
 Scenario: Sending a text message  
 Given I am in a chat room  
 When I type a message and press "Send"  
 Then the message should appear in the chat  
 And other users in the chat should see my message  
User Story 3: Share Images
As a user, I want to send images to friends to share visual content.

gherkin
Copy code
Feature: Share Images  
 Scenario: Uploading and sending an image  
 Given I am in a chat room  
 When I select the "Image" button and choose a file  
 Then the selected image should upload  
 And it should appear in the chat interface  
User Story 4: Share Location
As a user, I want to share my current location for easier coordination.

gherkin
Copy code
Feature: Share Location  
 Scenario: Sharing location data  
 Given I am in a chat room  
 When I select the "Location" button and confirm sharing  
 Then my coordinates should appear on the map in the chat  
User Story 5: Offline Message Reading
As a user, I want to access my chat history offline to stay informed even without connectivity.

gherkin
Copy code
Feature: Offline Message Reading  
 Scenario: Viewing cached messages  
 Given I have received messages previously  
 When I lose internet connectivity  
 Then I should still be able to view past messages  
Technical Requirements
React Native and Expo for cross-platform development
Firebase Firestore for real-time chat storage
Firebase Authentication for anonymous login
Firebase Storage for media uploads
Gifted Chat for chat UI and message handling
Expo Location for sharing and mapping user locations
Getting Started
Prerequisites
Node.js (16.19.0)
Expo CLI
Expo Go app (mobile testing)
Firebase project with Firestore, Storage, and Authentication configured
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/your-username/chatify.git  
cd chatify  
Install dependencies:

bash
Copy code
npm install  
Add Firebase configuration:

Create firebaseConfig.js in the config/ directory:
javascript
Copy code
export const firebaseConfig = {
apiKey: "YOUR_API_KEY",
authDomain: "YOUR_AUTH_DOMAIN",
projectId: "YOUR_PROJECT_ID",
storageBucket: "YOUR_STORAGE_BUCKET",
messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
appId: "YOUR_APP_ID",
};
Running the Application
Start the development server:

bash
Copy code
npm start  
Open the app:

Use the Expo Go app to scan the QR code
Or press a for Android emulator, i for iOS simulator
Troubleshooting
Common Issues
Issue: Image not displaying
Ensure that images are uploaded to Firebase Storage successfully.
Confirm correct uri property in MessageImage components.
Issue: Offline messages not appearing
Check local caching using AsyncStorage.
Issue: Location not sharing
Verify location permissions on your device.
Dependencies
json
Copy code
{
"@expo/metro-runtime": "~4.0.0",
"@react-native-async-storage/async-storage": "1.23.1",
"@react-native-community/netinfo": "^11.4.1",
"@react-navigation/native": "^6.1.18",
"@react-navigation/native-stack": "^6.11.0",
"@react-navigation/stack": "^6.4.1",
"dayjs": "^1.11.13",
"expo": "~52.0.18",
"expo-av": "~15.0.1",
"expo-cli": "^6.3.10",
"expo-image-picker": "~16.0.3",
"expo-location": "~18.0.4",
"expo-status-bar": "~2.0.0",
"firebase": "^10.14.1",
"react": "18.3.1",
"react-dom": "18.3.1",
"react-native": "0.76.5",
"react-native-gifted-chat": "^2.6.4",
"react-native-maps": "1.18.0",
"react-native-safe-area-context": "4.12.0",
"react-native-screens": "~4.4.0",
"react-native-web": "~0.19.13",
"uuid": "^11.0.4",
"expo-media-library": "~17.0.4",
"react-native-svg": "15.8.0"
}
Project Structure
lua
Copy code
chatify/  
├── assets/  
├── components/  
│ ├── Chat.js  
│ ├── CustomActions.js  
│ └── Start.js  
├── config/  
│ └── firebaseConfig.js  
├── App.js  
└── package.json  
Contributing
Fork the repository
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a pull request
