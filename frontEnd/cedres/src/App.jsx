import './styles/App.css'
import {Route, Routes} from "react-router-dom";
import {ADMIN, CONNEXION, STUDENT} from "./utils/routes.js";
import Courses from "./pages/students/Courses.jsx";
import Home from "./pages/Home.jsx";
import Connexion from "./pages/Connexion.jsx";
import StudentsList from "./pages/admin/StudentsList.jsx";
import CreateStudent from "./pages/admin/CreateStudent.jsx";
import NavTop from "./components/navBar/NavTop.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import {adminUrl, studentUrl, visitorUrl} from "./utils/nav_url.js";
import Signup from "./pages/students/Signup.jsx";
import Profil from "./pages/students/Profil.jsx";
import HomeAdmin from "./pages/admin/HomeAdmin.jsx";
import HomeStudent from "./pages/students/HomeStudent.jsx";
import {useState} from "react";
import Facilities from "./pages/students/Facilities.jsx";
import AskFacilities from "./pages/students/AskFacilities.jsx";
import Docs from "./pages/students/Docs.jsx";
import Calend from "./pages/students/Calend.jsx";
import AllList from "./pages/admin/AllList.jsx";
import ListAsk from "./pages/admin/ListAsk.jsx";
import ListLog from "./pages/admin/ListLog.jsx";
import Teacher from "./pages/teacher/Teacher.jsx";
import Secretary from "./pages/secretary/Secretary.jsx";
import Examens from "./pages/students/Examens.jsx";
import DeadLine from "./pages/admin/DeadLine.jsx";

function App()
{
    let buffer = visitorUrl;
    if (localStorage.getItem('type') !== null && localStorage.getItem('type') === 'student')
        buffer = studentUrl;
    else if (localStorage.getItem('type') !== null && localStorage.getItem('type') === 'admin')
        buffer = adminUrl;
    else
        buffer = visitorUrl;
    const [getWho, setWho] = useState(buffer);

    return (
        <div className="App">
            <NavTop who={getWho}/>
            <Routes>
                <Route exact path="/" element={<Home/>}/>
                <Route path={CONNEXION + "/:user"} element={<Connexion setUrl={setWho}/>}/>

                <Route path={ADMIN} element={<HomeAdmin/>}/>
                <Route path={ADMIN + "/students"} element={<StudentsList/>}/>
                <Route path={ADMIN + "/students/add"} element={<CreateStudent/>}/>
                <Route path={ADMIN + "/list"} element={<AllList/>}/>
                <Route path={ADMIN + "/list-ask"} element={<ListAsk/>}/>
                <Route path={ADMIN + "/log"} element={<ListLog/>}/>
                <Route path={ADMIN + "/deadline"} element={<DeadLine/>}/>

                <Route path={STUDENT} element={<HomeStudent/>}/>
                <Route path={STUDENT + "/courses"} element={<Courses/>}/>
                <Route path={STUDENT + "/facilities"} element={<Facilities/>}/>
                <Route path={STUDENT + "/first/:id"} element={<Signup/>}/>
                <Route path={STUDENT + "/aboutMe"} element={<Profil/>}/>
                <Route path={STUDENT + "/ask"} element={<AskFacilities/>}/>
                <Route path={STUDENT + "/docs"} element={<Docs/>}/>
                <Route path={STUDENT + "/calendar"} element={<Calend/>}/>
                <Route path={STUDENT + "/ask-exam/:ask"} element={<Examens/>}/>

                <Route path={"invite/teacher/:id"} element={<Teacher/>}/>
                <Route path={"invite/secretary/:id"} element={<Secretary/>}/>
            </Routes>
        </div>
  )
}

export default App
