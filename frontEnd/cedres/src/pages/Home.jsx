import {useNavigate} from "react-router-dom";
import {CONNEXION} from "../utils/routes.js";
import {Button, Stack} from "react-bootstrap";

const Home = () =>
{
    const navigate = useNavigate();


    return(
        <Stack gap={2} className="col-md-5 mx-auto p-5">
            <Button onClick={() => navigate(CONNEXION + "/admin")} variant="secondary">Je travaille au cèdre</Button>
            <Button onClick={() => navigate(CONNEXION + "/student")} variant="outline-secondary">Je suis un étudiant</Button>
        </Stack>
    )
}
export default Home;