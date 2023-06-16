import {Button, Table} from "react-bootstrap";
import {getListCoure, getListCourseStudent, getListFaculty} from "../../utils/api.js";
import {useQuery} from "@tanstack/react-query";
import {useMemo} from "react";
import {useNavigate} from "react-router-dom";

const ResearchListTab = ({data}) =>
{
    const navigate = useNavigate();

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
                             <td>{dt.type==='etudiant'?
                                 <Button onClick={() => navigate("/cedres/students/"+dt.id)} variant="warning">voir</Button>:
                                 <Button onClick={() => navigate("/cedres/list/")} variant="warning">voir</Button>
                             }</td>
                         </tr>
                     )
                 })
            }
            </tbody>
        </Table>
    )
}
export default ResearchListTab