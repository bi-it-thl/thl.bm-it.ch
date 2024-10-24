<?php
// Show all errors for debugging purposes
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Check if the request method is POST (i.e., the form was submitted)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve form data and sanitize it to prevent XSS attacks
    $name = htmlspecialchars($_POST['name']);
    $surname = htmlspecialchars($_POST['surname']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);

    // Check if all fields are filled
    if (!empty($name) && !empty($surname) && !empty($email) && !empty($message)) {
        // Email address where the message will be sent
        $to = 'loris.thuli@espas.ch'; 
        $subject = 'New message from your website';
        
        // Create the email body
        $body = "Name: $name\n";
        $body .= "Surname: $surname\n";
        $body .= "Email: $email\n\n";
        $body .= "Message:\n$message\n";

        // Email headers
        $headers = "From: $email\r\n";
        $headers .= "Reply-To: $email\r\n";

        // Send the email and check if it was successful
        if (mail($to, $subject, $body, $headers)) {
            // If successful, output 'success'
            echo 'success';
        } else {
            // If sending the email fails, output 'error'
            echo 'error';
        }
    } else {
        // If any fields are empty, output 'empty_fields'
        echo 'empty_fields';
    }
} else {
    // If the request method is not POST, output 'invalid_request'
    echo 'invalid_request';
}
