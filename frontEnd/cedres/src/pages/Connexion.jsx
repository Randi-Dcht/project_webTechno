import {useParams} from "react-router-dom";

const Connexion = ({set_user}) =>
{
    const param = useParams();
    const id = param.user;

    localStorage.setItem("type", id)
    set_user(id)

    return(
        <div>
            <h5>connexion {id}</h5>
            <h5>vous êtes connecté</h5>
        </div>
    )
}

export default Connexion;