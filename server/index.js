import app from "./app.js";
import { PORT } from "./config/serverConfig.js";
import { infoMessage } from "./utils/logger.js";

app.listen(PORT, () => {
  infoMessage(`Server running on port ${PORT}`);
});
