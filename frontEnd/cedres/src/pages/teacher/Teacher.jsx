import {Container} from "react-bootstrap";
import {useParams} from "react-router-dom";
import ListStudentByTeacher from "../../components/board/ListStudentByTeacher.jsx";

const Teacher = () =>
{
    const param = useParams();
    const myId = param.id

    return(
        <Container>
            <h2 className="m-4">Liste des étudiants</h2>
            <ListStudentByTeacher myId={myId}/>
        </Container>
    )
}
export default Teacher;