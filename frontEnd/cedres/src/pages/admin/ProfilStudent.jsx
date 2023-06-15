import {useNavigate, useParams} from "react-router-dom";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    getListFacilitiesCourse,
    getListFacilitiesExam,
    getStudent,
    postUpdatePasswordStudent,
    updateStudent
} from "../../utils/api.js";
import React, {useCallback} from "react";
import {Col, Container, Nav, Row, Tab} from "react-bootstrap";
import StudentForm from "../../components/forms/StudentForm.jsx";
import UpdatePassForm from "../../components/forms/UpdatePassForm.jsx";
import CourseTab from "../../components/board/CourseTab.jsx";
import FacilitiesTab from "../../components/board/FacilitiesTab.jsx";
import CourseFacilitiesTab from "../../components/board/CourseFacilitiesTab.jsx";
import ExamFacilitiesTab from "../../components/board/ExamFacilitiesTab.jsx";
import DocsTab from "../../components/board/DocsTab.jsx";

const ProfilStudent = () =>
{
    const navigate = useNavigate()
    const client = useQueryClient();
    const param = useParams();

    const matriculate = param.id

    const {data, isLoading} = useQuery(
    {
        queryKey: ['student'],
        queryFn: () => getStudent(matriculate),
    });
    
    const mutation = useMutation({
        mutationFn: updateStudent,
        onSuccess: async data => {
            await client.invalidateQueries(['student']);
        }
    });
    
    
    const onSubmit = useCallback(values => {
        mutation.mutate(values);
    }, [mutation]);
    
    return(
        <Container>
            <h3 className="m-3">Profil de l'élève :</h3>
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                <Row>
                    <Col sm={3}>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="first">Informations</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="course">Cours</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="facilitiesCourse">Aménagements cours</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="facilitiesExam">Aménagements examen</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="askJa">Demandes janvier</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="askJu">Demandes juin</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="askAt">Demandes aout</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="doc">Documents</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={9}>
                        <Tab.Content>
                            <Tab.Pane eventKey="first">
                                {
                                    isLoading? <p>Chargement ...</p>: <StudentForm onSubmit={onSubmit} name_button="Mettre à jour" data_default={
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
                            <Tab.Pane eventKey="course">
                                <CourseTab student={matriculate}/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="facilitiesCourse">
                                <FacilitiesTab getter={getListFacilitiesCourse(matriculate)} name='course'/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="facilitiesExam">
                                <FacilitiesTab getter={getListFacilitiesExam(matriculate)} name='exam'/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="askJa">
                                <ExamFacilitiesTab session='1' Ukey='listExamFacilities1' showButton={false} student={matriculate}/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="askJu">
                                <ExamFacilitiesTab session='2' Ukey='listExamFacilities2' showButton={false} student={matriculate}/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="askAt">
                                <ExamFacilitiesTab session='3' Ukey='listExamFacilities3' showButton={false} student={matriculate}/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="doc">
                                <DocsTab student={matriculate}/>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </Container>
    )
}

export default ProfilStudent