import { useEffect } from "react";
import AppRouter from "./routes/AppRouter";
import { showDemoNotice } from "@/services/alertService";

function App() {
  useEffect(() => {
    showDemoNotice();
  }, []);

  return <AppRouter />;
}

export default App;
