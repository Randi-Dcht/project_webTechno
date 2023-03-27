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
import {URL_CEDRES, URL_STUDENT, URL_VISITOR} from "./utils/nav_url.js";
import {useState} from "react";
import Signup from "./pages/students/Signup.jsx";


function getNav(type)
{
    if (type === "admin")
        return URL_CEDRES
    else if (type === "student")
        return URL_STUDENT
    else
        return URL_VISITOR
}

function App()
{
    const [url, setUrl] = useState("Umons Cèdres");

    return (
        <div className="App">
            <NavTop name={url} list_url={getNav(url)}/>
            <Routes>
                <Route exact path="/" element={<Home/>}/>
                <Route path={STUDENT + "/course"} element={<Courses/>}/>
                <Route path={CONNEXION + "/:user"} element={<Connexion set_user={setUrl}/>}/>
                <Route path={ADMIN + "/students"} element={<StudentsList/>}/>
                <Route path={ADMIN + "/students/add"} element={<CreateStudent/>}/>
                <Route path={STUDENT + "/first/:id"} element={<Signup/>}/>
            </Routes>
        </div>
  )
}

export default App
