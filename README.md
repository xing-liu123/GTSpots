# Campus Study Spots
Campus Study Spots is a mobile application built with React Native that allows students to view and update the availability of study spots on their university campus. The app provides information about various buildings, including the current availability level, noise level, WiFi stability, and amenities such as monitors and sockets.

## Features
- View a list of campus buildings with their current availability status
- Tap on a building to view detailed information and update the status
- Update availability, noise level, and WiFi stability using intuitive controls
- Indicate the presence of monitors and sockets in each building
- Reminders for successful updates and warnings for unsaved changes

## Prerequisites
- Node.js and npm (Node Package Manager)
- MongoDB (installed locally)

## Installation
1. Clone the repository:
`git clone https://github.com/xing-liu123/GTSpots.git`

2. Install the dependencies:
`npm install`

3. Install MongoDB locally on your machine. You can download and install MongoDB from the official website: `https://www.mongodb.com/try/download/community`

4. Start the MongoDB server by running the following command in a separate terminal: `mongod`

5. Initialize the seed database by running the following command in the project directory: `node server/seedDatabase.js`

6. Start the development server:
`npm start`

8. Follow the instructions in the terminal to run the app on an iOS or Android simulator or on a physical device.

## Usage
- Launch the Campus Study Spots app on your device.
- Browse the list of campus buildings on the home screen.
- Tap on a building to view detailed information about its study spots.
- Update the availability, noise level, WiFi stability, and amenities using the provided controls.
- Tap the "Update Status" button to save your changes.
- Navigate back to the home screen to see the updated information.

## Technologies Used
- React Native
- React Navigation
- Expo
- Node.js
- Express.js
- MongoDB
