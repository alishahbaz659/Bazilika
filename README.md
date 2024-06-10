# Bazilika

This project is a selfie-taking application developed using the Electron React boilerplate, designed to work with a Logitech Brio camera in portrait mode. The application is installed in a kiosk placed in front of a building in Budapest, Hungary, during Christmas 2023.

## Features

1. **Attract Loop**: A looping video runs to attract users to the screen.
2. **Interactive Screen**: The main screen appears once the screen is touched, initiating user interaction.
3. **Language Selection**:
    - Users can select their preferred language, which affects the final design overlay of the photo.
    - For example:
        - Selecting the UK flag results in an overlay saying "Merry Christmas".
        - Selecting the German flag results in an overlay saying "Frohe Weihnachten".
4. **Photo Capture**:
    - After selecting a language, users can click the camera icon.
    - A 3-second countdown is displayed before the photo is taken.
5. **Email Functionality**:
    - The captured photo can be sent out via email.
6. **Return to Idle**:
    - After the email is sent, the screen returns to the attract/idle screen.

## Installation

To run this application, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/selfie-taking-program.git
    ```
2. Navigate to the project directory:
    ```bash
    cd selfie-taking-program
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```
4. Start the application:
    ```bash
    npm start
    ```

## Usage

1. Ensure the Logitech Brio camera is connected and set to portrait mode.
2. Launch the application and verify the attract loop video is running.
3. Touch the screen to initiate the interactive mode.
4. Select the desired language to customize the photo overlay.
5. Click the camera icon to take a photo after a 3-second countdown.
6. Enter the email address to send the captured photo.
7. The application will return to the attract loop after the email is sent.

## License

This project is licensed under the MIT License.

Video Demo:
https://youtu.be/6Pzmcl48veU

<img src="https://github.com/alishahbaz659/Bazilika/blob/ef5b1bc15f1cae5c047a247960c156dea348a461/Deployed%20Image/image.jpg?raw=true" alt="Selfie Taking Kiosk" width="400" height="300">s

![alt text](https://github.com/alishahbaz659/Bazilika/blob/ef5b1bc15f1cae5c047a247960c156dea348a461/Deployed%20Image/image.jpg?raw=true)
