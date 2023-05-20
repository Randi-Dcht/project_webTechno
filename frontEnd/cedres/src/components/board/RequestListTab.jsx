import {Button, Table} from "react-bootstrap";
import {getListCoure, getListCourseStudent, getListFaculty} from "../../utils/api.js";
import {useQuery} from "@tanstack/react-query";
import {useMemo} from "react";

const RequestListTab = ({data}) =>
{

   const lineTab = useMemo(() =>
   {
       return data?.map(req =>
       {
           return(
               <tr key={req.id}>
                   <td>{req.student}</td>
                   <td>{req.exam}</td>
                   <td>{req.status}</td>
                   <td>{req.comment}</td>
                   <td><Button variant='warning'>Modifier</Button></td>
               </tr>
           )
       })
   }, [data])


    return(
        <Table>
            <thead>
            <tr>
                <td>Elève</td><td>Examen</td><td>Status</td><td>Commentaire</td><td>Action</td>
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