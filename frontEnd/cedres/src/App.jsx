import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './styles/App.css'
import {Route, Routes} from "react-router-dom";
import {STUDENT} from "./utils/routes.js";
import LoadPages from "./components/LoadPages.jsx";
import Courses from "./pages/students/Courses.jsx";
import Home from "./pages/Home.jsx";

function App()
{

  return (
    <div className="App">
        <Routes>
            <Route exact path="/" element={<Home/>}/>
            <Route path={STUDENT + "/course"} element={<Courses/>}/>
        </Routes>
    </div>
  )
}

export default App
