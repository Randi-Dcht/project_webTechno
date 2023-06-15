import {Button, Container, Tab, Tabs} from "react-bootstrap";
import CourseFacilitiesTab from "../../components/board/CourseFacilitiesTab.jsx";
import ExamFacilitiesTab from "../../components/board/ExamFacilitiesTab.jsx";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getActiveButton, postAskFacilitiesExamen} from "../../utils/api.js";
import {useCallback} from "react";
import NoButton from "../../components/NoButton.jsx";

const AskFacilities = () =>
{
    const client = useQueryClient();

    const mutation = useMutation({
        mutationFn: postAskFacilitiesExamen,
        onSuccess: async data => {
            await client.invalidateQueries(['listExamFacilities1', 'listExamFacilities2', 'listExamFacilities3']);
            window.location.reload();
        }
    });


    const onSubmit = useCallback(quadri => {
        mutation.mutate({
            'student': localStorage.getItem('id'),
            'quadrimester': quadri
        });
    }, [mutation]);

    const {data, isLoading} = useQuery(
        {
            queryKey:['activeButton'],
            queryFn: getActiveButton,
        })


    return(
        <Container>
            <h3 className="m-2">Mes aménagements demandés:</h3>
            {isLoading? <p>chargement ...</p>:<Tabs
                defaultActiveKey="course"
                id="uncontrolled-tab-example"
                className="mb-3"
            >
                <Tab eventKey="course" title="Cours">
                    <CourseFacilitiesTab student={localStorage.getItem('id')}/>
                </Tab>
                <Tab eventKey="exam-1" title="Examen janvier">
                    {data.active==="session1"?<Button variant="warning" onClick={()=>onSubmit(1)}>Créer une demande pour janvier</Button>:<NoButton/>}
                    <ExamFacilitiesTab session='1' Ukey='listExamFacilities1' showButton={data.active==="session1"} student={localStorage.getItem('id')}/>
                </Tab>
                <Tab eventKey="exam-2" title="Examen juin">
                    {data.active==="session2"?<Button variant="warning" onClick={()=>onSubmit(2)}>Créer une demande pour juin</Button>:<NoButton/>}
                    <ExamFacilitiesTab session='2' Ukey='listExamFacilities2' showButton={data.active==="session2"} student={localStorage.getItem('id')}/>
                </Tab>
                <Tab eventKey="exam-3" title="Examen août">
                    {data.active==="session3"?<Button variant="warning" onClick={()=>onSubmit(3)}>Créer une demande pour août</Button>:<NoButton/>}
                    <ExamFacilitiesTab session='3' Ukey='listExamFacilities3' showButton={data.active==="session3"} student={localStorage.getItem('id')}/>
                </Tab>
            </Tabs>}
        </Container>
    )
}
export default AskFacilities;