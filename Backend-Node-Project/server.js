// This file is the entry point of the application. It starts the server and listens on port PORT || 3000.

import "dotenv/config"; // Load environment variables
import app from "./app.js"; // Import the express app

const port = process.env.PORT || 3000; 

// Start the server
const server = app.listen(port, () => {
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Server is running on port http://localhost:${port}`);
});

export default server;