import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    getListExamFacilitiesStudent,
    getMyExam,
    getMyExamList,
    postMyExam,
    postSignupStudent, postUpdateFacilitiesExam, postUpdateStatusExam
} from "../../utils/api.js";
import {useNavigate, useParams} from "react-router-dom";
import ExamFacilitiesForm from "../../components/forms/ExamFacilitiesForm.jsx";
import {CONNEXION} from "../../utils/routes.js";
import {useCallback} from "react";
import {Button, Container, ListGroup} from "react-bootstrap";

const ActionButton = ({id,status, title}) =>
{
    const client = useQueryClient();

    const mutation = useMutation({
        mutationFn: postUpdateFacilitiesExam,
        onSuccess: async data => {
            await client.invalidateQueries(['listFacilitiesExam']);
            window.location.reload()
        }
    });


    const onSubmit = useCallback(() => {
        mutation.mutate({
            'id': id,
            'status': status
        });
    }, [mutation]);

    return(
        <Button style={{marginLeft:'5px'}} onClick={()=>onSubmit()} variant={"warning"}>{title}</Button>
    )
}

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
                           <ListGroup.Item style={{display:'flex', justifyContent:'space-between', alignItems:'center'}} key={index}>{d.facilitie}
                               {d.used==='true'? <ActionButton id={d.id} title="Pas besoin" status="false"/>:<ActionButton id={d.id} title="Besoin" status="true"/>}
                           </ListGroup.Item>
                       )
                   })
            }
        </ListGroup>
    )

}


const Examens = () =>
{
    const examNumber = useParams().ask;
    const navigate = useNavigate()

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
            <Button className='m-5' variant={"warning"} onClick={() => history.back()}>Quitter</Button>
        </Container>
    )
}
export default Examens;