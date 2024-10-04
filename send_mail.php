<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Hole die Formulardaten
    $name = htmlspecialchars($_POST['name']);
    $surname = htmlspecialchars($_POST['surname']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);

    // Überprüfe, ob alle Felder ausgefüllt sind
    if (!empty($name) && !empty($surname) && !empty($email) && !empty($message)) {
        // E-Mail-Adresse, an die die Nachricht gesendet werden soll
        $to = 'loris.thuli@espas.ch'; 
        $subject = 'Neue Nachricht von deiner Webseite';
        
        // Erstelle die Nachricht
        $body = "Name: $name\n";
        $body .= "Nachname: $surname\n";
        $body .= "E-Mail: $email\n\n";
        $body .= "Nachricht:\n$message\n";

        // E-Mail-Header
        $headers = "From: $email\r\n";
        $headers .= "Reply-To: $email\r\n";

        // Versende die E-Mail
        if (mail($to, $subject, $body, $headers)) {
            echo 'success';
        } else {
            echo 'error';
        }
    } else {
        echo 'empty_fields';
    }
} else {
    echo 'invalid_request';
}
