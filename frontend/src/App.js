
import Homepage from "./Pages/Homepage.js";
import { Route } from "react-router-dom";
import Chatpage from "./Pages/Chatpage.js";

import SingleChat from "./components/SingleChat";
import './App.css';
import { Box } from "@chakra-ui/react";

function App() {
  return (
    <Box>
      {/* Your other components */}
      <div className="App">
        <Route path="/" component={Homepage} exact />
        <Route path="/chats" component={Chatpage} />
        {/* <Route path="*" element={<Navigate to="/login" /> } /> */}
      </div>
    </Box>
  );
}

export default App;
