import {BrowserRouter, Route, Routes} from "react-router-dom";
import Navbar from "./navbar/Navbar";
import "./app.scss";
import Registration from "./authorization/Registration";
import Login from "./authorization/Login";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar/>
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/registration" element={<Registration/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
