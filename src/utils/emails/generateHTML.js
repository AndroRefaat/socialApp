export const signup = (otp) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Activate Your Account</title>
    <style type="text/css">
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            background-color: white;
            width: 50%;
            margin: 50px auto;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: red;
            color: white;
            padding: 15px;
            font-size: 20px;
            font-weight: bold;
            border-radius: 10px 10px 0 0;
        }
        .content {
            padding: 20px;
        }
        .content h2 {
            font-size: 24px;
        }
        .content img {
            width: 50px;
        }
        .activate-btn {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 18px;
            color: white;
            background-color: red;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
        }
        .footer {
            font-size: 14px;
            color: gray;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            Socail App
        </div>
        <div class="content">
            <h2>Welcome!</h2>
            <p>Click the button below to activate your account.</p>
            <a href="" class="activate-btn">${otp}</a>
        </div>
        <div class="footer">
            If you have any questions, just reply to this email—we’re always happy to help out.
        </div>
    </div>
</body>
</html>`;



export const verifyEmail = (url) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Activate Your Account</title>
    <style type="text/css">
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            background-color: white;
            width: 50%;
            margin: 50px auto;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: red;
            color: white;
            padding: 15px;
            font-size: 20px;
            font-weight: bold;
            border-radius: 10px 10px 0 0;
        }
        .content {
            padding: 20px;
        }
        .content h2 {
            font-size: 24px;
        }
        .content img {
            width: 50px;
        }
        .activate-btn {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 18px;
            color: white;
            background-color: red;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
        }
        .footer {
            font-size: 14px;
            color: gray;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            Socail App
        </div>
        <div class="content">
            <h2>Welcome!</h2>
            <p>Click the button below to activate your account.</p>
            <a href=${url} class="activate-btn">"verify email"</a>
        </div>
        <div class="footer">
            If you have any questions, just reply to this email—we’re always happy to help out.
        </div>
    </div>
</body>
</html>`;
