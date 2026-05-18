const app = require("./app");
const { connectDB } = require("./config/db");
const { seedEmployees } = require("./utils/seedEmployees");

const port = process.env.PORT || 5050;

async function startServer() {
  try {
    await connectDB();
    await seedEmployees();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
