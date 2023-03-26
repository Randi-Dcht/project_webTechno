import {useParams} from "react-router-dom";

const Connexion = () =>
{
    const param = useParams();
    const id = param.user;

    return(
        <div>
            connexion {id}
        </div>
    )
}

export default Connexion;