import {useNavigate, useParams} from "react-router-dom";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getNewStudent, getStudent, postSignupStudent, updateStudent} from "../../utils/api.js";
import {CONNEXION} from "../../utils/routes.js";
import React, {useCallback} from "react";
import {Col, Container, Nav, Row, Tab} from "react-bootstrap";
import StudentForm from "../../components/forms/StudentForm.jsx";

const Profil = () =>
{
    const navigate = useNavigate()
    const client = useQueryClient();
    const param = useParams();

    const matriculate = "191919"

    const {data, isLoading} = useQuery(
        {
            queryKey: ['studentMe'],
            queryFn: () => getStudent(matriculate),
        });

    const mutation = useMutation({
        mutationFn: updateStudent,
        onSuccess: async data => {
            await client.invalidateQueries(['student']);
            navigate(CONNEXION + '/student')
        }
    });


    const onSubmit = useCallback(values => {
        mutation.mutate(values);
    }, [mutation]);

    return(
        <Container>
            <h3 className="m-2">Mon profil :</h3>
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
                                <p>vide</p>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </Container>
    )
}

export default Profil