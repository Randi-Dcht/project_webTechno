import {useMutation, useQuery} from "@tanstack/react-query";
import {
    getListExamFacilitiesStudent,
    getMyExam,
    getMyExamList,
    postMyExam,
    postSignupStudent
} from "../../utils/api.js";
import {useNavigate, useParams} from "react-router-dom";
import ExamFacilitiesForm from "../../components/forms/ExamFacilitiesForm.jsx";
import {CONNEXION} from "../../utils/routes.js";
import {useCallback} from "react";
import {Button, Container, ListGroup} from "react-bootstrap";

const listFacilities = (nb) =>
{
    const {data, isLoading} = useQuery(
        {
            queryKey: ['examFacilitieList'],
            queryFn: () => getMyExamList(nb)
        });

    return(
        <ListGroup>
            <p>Aménagements :</p>
            {
               isLoading?
                   <p>Chargement ...</p>:
                   data.map((d, index) =>
                   {
                       return(
                           <ListGroup.Item style={{display:'flex', justifyContent:'space-between', alignItems:'center'}} key={index}>{d.facilitie} <Button className='m-1' variant='light'>X</Button></ListGroup.Item>
                       )
                   })
            }
        </ListGroup>
    )

}


const Examens = () =>
{
    const examNumber = useParams().ask;

    const {data, isLoading} = useQuery(
        {
            queryKey: ['examFacilitie'],
            queryFn: () => getMyExam(examNumber)
        });

    return(
        <Container style={{marginTop:'50px'}}>
            {
                isLoading? <p>Chargement ...</p>:
                    <ExamFacilitiesForm data_default={data}/>
            }
            {
                listFacilities(examNumber)
            }
            <Button className='m-5'>Quitter</Button>
        </Container>
    )
}
export default Examens;