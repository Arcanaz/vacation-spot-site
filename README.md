# Vacation Spot Site

This is a web application where users can explore vacation spots, create new listings, edit their own listings, and leave reviews on others' listings. Users can sign up, log in, and manage their spots, while also interacting with other users by providing feedback.

## Features

- **User Authentication:**  
  Users can register, log in, and maintain sessions. Login is handled through Passport.js with local strategy.

- **Vacation Spot Listings:**  
  Users can create vacation spot listings, including descriptions, photos, and other details. They can edit or delete their own listings.

- **Review System:**  
  Users can leave reviews for vacation spots created by other users. They can rate and provide feedback.

- **Flash Messages:**  
  The app uses flash messages to notify users of successful actions or errors, providing a smooth user experience.

- **Session Management:**  
  Sessions are handled with Express Session and MongoDB, allowing users to remain logged in during their visit.

## Technologies Used

- **Frontend:**  
  - HTML
  - CSS (with custom stylesheets for various pages)
  - EJS templating engine for views
  - Express EJS Layouts for handling common layout elements
  - Cloudinary for image hosting and manipulation

- **Backend:**  
  - Node.js with Express
  - MongoDB and Mongoose for data storage
  - Passport.js for authentication
  - Express Session and Connect-Mongo for session management
  - Mongo Sanitize to prevent injection attacks
