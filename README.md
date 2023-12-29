# Credit Card Form App

## Overview

The **Credit Card Form App** is a simple web application that allows users to enter and validate credit card information. It provides a visually appealing interface to input and view credit card details, including the card number, cardholder name, expiration date, and CVV.

![App Preview](app-preview.png)

The application is built using HTML, CSS, and JavaScript to provide a seamless user experience for entering credit card information securely.

## Features

- **Credit Card Validation**: The app validates credit card numbers using regular expressions to detect card brands such as Visa, MasterCard, American Express, and more.

- **Real-time Formatting**: As the user enters the credit card number, it is formatted in real-time to make it visually appealing and mask sensitive information.

- **Expiration Date Selection**: Users can select the card's expiration month and year from dropdown menus for a convenient input method.

- **CVV Input**: The app supports entering the Card Verification Value (CVV) and displays it as asterisks for security.

- **Card Brand Recognition**: The app dynamically recognizes the card brand based on the entered credit card number and displays the corresponding card logo.

- **Form Submission**: When users submit the form, the app collects the entered information and can be configured to perform actions like sending the data to a server for further processing.

## Installation

To run the Credit Card Form App locally, follow these steps:

1. Clone this repository to your local machine:

git clone https://github.com/nvmwhoiam/Credit-card-from.git

2. Open the `index.html` file in your web browser.

3. You can also serve the app using a local development server if you have one available.

## Usage

1. Open the app in your web browser.

2. Enter the credit card details in the provided input fields:

- **Card Holder**: Enter the name on the credit card.
- **Card Number**: Enter the 16-digit credit card number.
- **Expiration Date**: Select the card's expiration month and year.
- **CVV**: Enter the Card Verification Value (CVV) found on the back of the card.

3. As you enter the card number, the app will automatically format and recognize the card brand.

4. Click the "Save" button to submit the form. You can customize this functionality to suit your needs.

## Customization

You can customize the app's behavior and appearance by modifying the JavaScript code in the `assets/js/index.js` file and the CSS in the `assets/css/index.css` file. Feel free to adapt it to your specific requirements.

## License

This Credit Card Form App is open-source and available under the [MIT License](LICENSE).

## Acknowledgments

- Credit card brand detection and validation are based on commonly used regular expressions found in various online resources.
