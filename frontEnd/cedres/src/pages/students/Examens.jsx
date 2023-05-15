import {useMutation, useQuery} from "@tanstack/react-query";
import {getListExamFacilitiesStudent, getMyExam, postMyExam, postSignupStudent} from "../../utils/api.js";
import {useParams} from "react-router-dom";
import ExamFacilitiesForm from "../../components/forms/ExamFacilitiesForm.jsx";
import {CONNEXION} from "../../utils/routes.js";
import {useCallback} from "react";
import {Container} from "react-bootstrap";

const Examens = () =>
{
    const examNumber = useParams().ask;

    const {data, isLoading} = useQuery(
        {
            queryKey: ['examFacilitie'],
            queryFn: () => getMyExam(examNumber)
        });

    const mutation = useMutation({
        mutationFn: postMyExam,
        onSuccess: async data => {
            await client.invalidateQueries(['examFacilitie']);
        }
    });


    const onSubmit = useCallback(values => {
        mutation.mutate(values);
    }, [mutation]);

    return(
        <Container style={{marginTop:'50px'}}>
            {
                isLoading? <p>chargement ...</p>:
                    <ExamFacilitiesForm onSubmit={onSubmit} data_default={data}/>
            }
        </Container>
    )
}
export default Examens;