import {Button, Container, Tab, Tabs} from "react-bootstrap";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    getQuadri,
    getRequestFinish,
    getRequestToValidate,
    getRequestWait, postUpdateQuadri,
    postUpdateStatusExam
} from "../../utils/api.js";
import RequestListTab from "../../components/board/RequestListTab.jsx";
import {useCallback} from "react";

const RequestToValidate = ({request, id, actionButton}) =>
{
    const {data, isLoading} = useQuery(
        {
            queryKey: [id],
            queryFn: request,
        });

    return(
        <>
            {
                isLoading? <p>Chargement ...</p>:
                    <RequestListTab data={data} actionbutton={actionButton}/>
            }
        </>
    )
}

const ListAsk = () =>
{
    return(
        <Container>
            <h3 className='m-3'>Les demandes :</h3>
            <Tabs defaultActiveKey="todo" id="fill-tab-example" className="mb-3" fill>
                <Tab eventKey="todo" title="Demandes à valider">
                    <RequestToValidate request={getRequestToValidate} id={'requestToValidate'} actionButton={3}/>
                </Tab>
                <Tab eventKey="valid" title="Demandes en attente (à revalider)">
                    <RequestToValidate request={getRequestWait} id={'requestWait'} actionButton={2}/>
                </Tab>
                <Tab eventKey="old" title="Demandes validées (anciennes)">
                    <RequestToValidate request={getRequestFinish} id={'requestFinish'} actionButton={1}/>
                </Tab>
            </Tabs>
        </Container>
    )
}
export default ListAsk;