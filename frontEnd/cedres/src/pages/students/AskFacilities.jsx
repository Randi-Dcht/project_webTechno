import {Button, Container, Tab, Tabs} from "react-bootstrap";
import CourseFacilitiesTab from "../../components/board/CourseFacilitiesTab.jsx";
import ExamFacilitiesTab from "../../components/board/ExamFacilitiesTab.jsx";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {postAskFacilitiesExamen} from "../../utils/api.js";
import {useCallback} from "react";

const AskFacilities = () =>
{
    const client = useQueryClient();

    const mutation = useMutation({
        mutationFn: postAskFacilitiesExamen,
        onSuccess: async data => {
            await client.invalidateQueries(['listExamFacilities1', 'listExamFacilities2', 'listExamFacilities3']);
        }
    });


    const onSubmit = useCallback(quadri => {
        mutation.mutate({
            'student': localStorage.getItem('id'),
            'quadrimester': quadri
        });
    }, [mutation]);


    return(
        <Container>
            <h3 className="m-2">Mes aménagements demandés:</h3>
            <Tabs
                defaultActiveKey="course"
                id="uncontrolled-tab-example"
                className="mb-3"
            >
                <Tab eventKey="course" title="Cours">
                    <CourseFacilitiesTab/>
                </Tab>
                <Tab eventKey="exam-1" title="Examen janvier">
                    <Button onClick={()=>onSubmit(1)}>Créer une demande pour janvier</Button>
                    <ExamFacilitiesTab session='1' Ukey='listExamFacilities1'/>
                </Tab>
                <Tab eventKey="exam-2" title="Examen juin">
                    <Button onClick={()=>onSubmit(2)}>Créer une demande pour juin</Button>
                    <ExamFacilitiesTab session='2' Ukey='listExamFacilities2'/>
                </Tab>
                <Tab eventKey="exam-3" title="Examen aout">
                    <Button onClick={()=>onSubmit(3)}>Créer une demande pour août</Button>
                    <ExamFacilitiesTab session='3' Ukey='listExamFacilities3'/>
                </Tab>
            </Tabs>
        </Container>
    )
}
export default AskFacilities;