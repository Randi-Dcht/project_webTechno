import './styles/App.css'
import {Route, Routes} from "react-router-dom";
import {ADMIN, CONNEXION, STUDENT} from "./utils/routes.js";
import LoadPages from "./components/LoadPages.jsx";
import Courses from "./pages/students/Courses.jsx";
import Home from "./pages/Home.jsx";
import Connexion from "./pages/Connexion.jsx";
import StudentsList from "./pages/admin/StudentsList.jsx";
import CreateStudentForm from "./components/forms/CreateStudentForm.jsx";

function App()
{

  return (
    <div className="App">
        <Routes>
            <Route exact path="/" element={<Home/>}/>
            <Route path={STUDENT + "/course"} element={<Courses/>}/>
            <Route path={CONNEXION + "/:user"} element={<Connexion/>}/>
            <Route path={ADMIN + "/students"} element={<StudentsList/>}/>
            <Route path={ADMIN + "/students/add"} element={<CreateStudentForm/>}/>
        </Routes>
    </div>
  )
}

export default App
