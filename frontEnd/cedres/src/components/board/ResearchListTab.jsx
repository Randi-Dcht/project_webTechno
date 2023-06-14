import {Table} from "react-bootstrap";
import {getListCoure, getListCourseStudent, getListFaculty} from "../../utils/api.js";
import {useQuery} from "@tanstack/react-query";
import {useMemo} from "react";

const ResearchListTab = ({data}) =>
{
    return(
        /*isLoading?
            <p>Chargement ...</p>:*/
        <Table>
            <thead>
            <tr>
                <td>Type</td><td>Données</td><td>Lien</td>
            </tr>
            </thead>
            <tbody>
            {
                 data.map(dt =>
                 {
                     return(
                         <tr key={dt.id}>
                             <td>{dt.type}</td>
                             <td>{dt.data}</td>
                             <td><a href="#">voir</a></td>
                         </tr>
                     )
                 })
            }
            </tbody>
        </Table>
    )
}
export default ResearchListTab