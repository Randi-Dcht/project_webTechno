import {Container, Tab, Tabs} from "react-bootstrap";
import {useQuery} from "@tanstack/react-query";
import {getListFaculty, getRequestFinish, getRequestToValidate, getRequestWait} from "../../utils/api.js";
import RequestListTab from "../../components/board/RequestListTab.jsx";

const RequestToValidate = ({request, id}) =>
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
                    <RequestListTab data={data}/>
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
                    <RequestToValidate request={getRequestToValidate} id={'requestToValidate'}/>
                </Tab>
                <Tab eventKey="valid" title="Demandes en attente (à revalider)">
                    <RequestToValidate request={getRequestWait} id={'requestWait'}/>
                </Tab>
                <Tab eventKey="old" title="Demandes validées (anciennes)">
                    <RequestToValidate request={getRequestFinish} id={'requestFinish'}/>
                </Tab>
            </Tabs>
        </Container>
    )
}
export default ListAsk;