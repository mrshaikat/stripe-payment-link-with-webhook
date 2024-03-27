import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CustomStripe from "./pages/CustomStripe";
import AllRequest from "./pages/AllRequest";
import Subscription from "./pages/Subscription";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<CustomStripe />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/subscription/all-request" element={<AllRequest/>} />
      </Routes>
    </Router>
  );
}

export default App;