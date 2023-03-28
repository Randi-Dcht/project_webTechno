import './styles/App.css'
import {Route, Routes} from "react-router-dom";
import {ADMIN, CONNEXION, STUDENT} from "./utils/routes.js";
import LoadPages from "./components/LoadPages.jsx";
import Courses from "./pages/students/Courses.jsx";
import Home from "./pages/Home.jsx";
import Connexion from "./pages/Connexion.jsx";
import StudentsList from "./pages/admin/StudentsList.jsx";
import CreateStudent from "./pages/admin/CreateStudent.jsx";
import NavTop from "./components/navBar/NavTop.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import {URL_CEDRES, URL_STUDENT, URL_VISITOR, visitorUrl} from "./utils/nav_url.js";
import Signup from "./pages/students/Signup.jsx";
import Profil from "./pages/students/Profil.jsx";
import HomeAdmin from "./pages/admin/HomeAdmin.jsx";
import HomeStudent from "./pages/students/HomeStudent.jsx";
import {useState} from "react";

function App()
{
    const [getWho, setWho] = useState(visitorUrl);

    return (
        <div className="App">
            <NavTop who={getWho}/>
            <Routes>
                <Route exact path="/" element={<Home/>}/>
                <Route path={CONNEXION + "/:user"} element={<Connexion setUrl={setWho}/>}/>

                <Route path={ADMIN} element={<HomeAdmin/>}/>
                <Route path={ADMIN + "/students"} element={<StudentsList/>}/>
                <Route path={ADMIN + "/students/add"} element={<CreateStudent/>}/>

                <Route path={STUDENT} element={<HomeStudent/>}/>
                <Route path={STUDENT + "/courses"} element={<Courses/>}/>
                <Route path={STUDENT + "/first/:id"} element={<Signup/>}/>
                <Route path={STUDENT + "/aboutMe"} element={<Profil/>}/>
            </Routes>
        </div>
  )
}

export default App
