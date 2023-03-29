import {useNavigate, useParams} from "react-router-dom";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getStudent, postUpdatePasswordStudent, updateStudent} from "../../utils/api.js";
import React, {useCallback} from "react";
import {Col, Container, Nav, Row, Tab} from "react-bootstrap";
import StudentForm from "../../components/forms/StudentForm.jsx";
import UpdatePassForm from "../../components/forms/UpdatePassForm.jsx";

const Profil = () =>
{
    const navigate = useNavigate()
    const client = useQueryClient();
    const param = useParams();

    const {data, isLoading} = useQuery(
        {
            queryKey: ['studentMe'],
            queryFn: () => getStudent(localStorage.getItem('id')),
        });

    const mutation = useMutation({
        mutationFn: updateStudent,
        onSuccess: async data => {
            await client.invalidateQueries(['studentMe']);
        }
    });


    const onSubmit = useCallback(values => {
        mutation.mutate(values);
    }, [mutation]);

    return(
        <Container>
            <h3 className="m-3">Mon profil :</h3>
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                <Row>
                    <Col sm={3}>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="first">Informations</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="second">Mot de passe</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={9}>
                        <Tab.Content>
                            <Tab.Pane eventKey="first">
                                {
                                    isLoading? <p>Chargement ...</p>: <StudentForm onSubmit={onSubmit} name_button="mettre à jour" data_default={
                                        {
                                            name : data.name,
                                            surname : data.surname,
                                            email : data.email,
                                            matricule : data.matricule,
                                            phone : data.phone,
                                            email_private : data.email_private,
                                            faculty : data.faculty
                                        }
                                    }/>
                                }
                            </Tab.Pane>
                            <Tab.Pane eventKey="second">
                                <UpdatePassForm url={postUpdatePasswordStudent}/>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </Container>
    )
}

export default Profil