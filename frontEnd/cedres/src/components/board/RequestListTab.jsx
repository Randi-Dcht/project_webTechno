import {Button, Table} from "react-bootstrap";
import {getListCoure, getListCourseStudent, getListFaculty, postUpdateStatusExam} from "../../utils/api.js";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useCallback, useMemo} from "react";
import {STUDENT} from "../../utils/routes.js";
import {useNavigate} from "react-router-dom";


const ActionButton = ({id, name, status, variant}) =>
{
    const client = useQueryClient();

    const mutation = useMutation({
        mutationFn: postUpdateStatusExam,
        onSuccess: async data => {
            await client.invalidateQueries(['buttonValidate']);
        }
    });


    const onSubmit = useCallback(() => {
        mutation.mutate({
            'id': id,
            'status': status
        });
    }, [mutation]);

    return(
        <Button style={{marginLeft:'5px'}} onClick={()=>onSubmit()} variant={variant}>{name}</Button>
    )
}

const RequestListTab = ({data, actionbutton}) =>
{
    const navigate = useNavigate()

   const lineTab = useMemo(() =>
   {
       return data?.map(req =>
       {
           return(
               <tr key={req.id}>
                   <td>{req.student}</td>
                   <td>{req.exam}</td>
                   <td>
                       <div>{req.date}</div>
                       <div>{req.local}</div>
                   </td>
                   <td>{req.comment}</td>
                   <td>
                       <Button variant='warning' onClick={() => navigate(STUDENT+'/ask-exam/'+req.id)}>Consulter</Button>
                       {actionbutton >= 2 && <ActionButton name="Valide" id={req.id} status="finish" variant='success'/>}
                       {actionbutton >= 3 && <ActionButton name="Non valide" id={req.id} status="update" variant='danger'/>}
                   </td>
               </tr>
           )
       })
   }, [data])


    return(
        <Table>
            <thead>
            <tr>
                <td>Elève</td><td>Examen</td><td>Date & local</td><td>Commentaire</td><td>Action</td>
            </tr>
            </thead>
            <tbody>
            {
                 lineTab
            }
            </tbody>
        </Table>
    )
}
export default RequestListTab