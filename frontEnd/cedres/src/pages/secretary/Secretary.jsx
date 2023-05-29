import {useParams} from "react-router-dom";
import {Container} from "react-bootstrap";
import ListStudentInFaculty from "../../components/board/ListStudentInFaculty.jsx";

const Secretary = () =>
{
    const param = useParams();
    const myId = param.id

    return(
        <Container>
            <h2>Liste des étudiants</h2>
            <ListStudentInFaculty myId={myId}/>
        </Container>
    )
}
export default Secretary;