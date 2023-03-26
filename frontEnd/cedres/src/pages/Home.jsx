import {useNavigate} from "react-router-dom";
import {CONNEXION} from "../utils/routes.js";

const Home = () =>
{
    const navigate = useNavigate();

    return(
        <div className="container text-center col-7">
           <nav className="navbar bg-body">
               <div className="container-fluid">
                   <button className="navbar-brand" onClick={() => navigate(CONNEXION + "/teacher")}>Connexion professeur</button>
               </div>
           </nav>
            <nav className="navbar bg-body">
                <div className="container-fluid">
                    <button className="navbar-brand" onClick={() => navigate(CONNEXION + "/student")}>Connexion élève</button>
                </div>
            </nav>
            <nav className="navbar bg-body">
                <div className="container-fluid">
                    <button className="navbar-brand" onClick={() => navigate(CONNEXION + "/admin")}>Connexion administrateur</button>
                </div>
            </nav>
            <nav className="navbar bg-body">
                <div className="container-fluid">
                    <button className="navbar-brand" onClick={() => navigate(CONNEXION + "/secretary")}>Connexion secrétariat</button>
                </div>
            </nav>
        </div>
    )
}
export default Home;