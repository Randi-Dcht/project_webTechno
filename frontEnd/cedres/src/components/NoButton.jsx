import {Alert} from "react-bootstrap";

const NoButton = () =>
{
    return(
        <Alert key="noButton" variant="warning">
            Pas d'action disponible pour l'instant
        </Alert>
    )

}

export default NoButton