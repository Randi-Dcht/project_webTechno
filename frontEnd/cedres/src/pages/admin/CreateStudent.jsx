import {useNavigate} from "react-router-dom";
import {useMutation, useQueryClient} from "react-query";
import {postNewStudent} from "../../utils/api.js";
import {useCallback} from "react";
import {Container, Row} from "react-bootstrap";
import NewStudentForm from "../../components/forms/NewStudentForm.jsx";

const CreateStudent = () =>
{
    const navigate = useNavigate()
    const client = useQueryClient();

    const mutation = useMutation({
        mutationFn: postNewStudent,
        onSuccess: async data => {
            await client.invalidateQueries(['create-student']);
            navigate("/")
        }
    })

    const onSubmit = useCallback(values => {
        mutation.mutate(values);
    }, [mutation]);

    return (
        <div>
            <Container>
                <h1>Ajouter un étudiant :</h1>
                <Row>
                    <NewStudentForm onSubmit={onSubmit}/>
                </Row>
            </Container>
        </div>
    );

}
export default CreateStudent;