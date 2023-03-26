import {useNavigate} from "react-router-dom";
import {CONNEXION} from "../utils/routes.js";
import {ListGroup} from "react-bootstrap";

const Home = () =>
{
    const navigate = useNavigate();


    return(
        <ListGroup>
            <ListGroup.Item action onClick={() => navigate(CONNEXION + "/teacher")}>
                Connexion professeur
            </ListGroup.Item>
            <ListGroup.Item action onClick={() => navigate(CONNEXION + "/student")}>
                Connexion élève
            </ListGroup.Item>
            <ListGroup.Item action onClick={() => navigate(CONNEXION + "/admin")}>
                Connexion administrateur
            </ListGroup.Item>
            <ListGroup.Item action  onClick={() => navigate(CONNEXION + "/secretary")}>
                Connexion secrétariat
            </ListGroup.Item>
        </ListGroup>
    )
}
export default Home;