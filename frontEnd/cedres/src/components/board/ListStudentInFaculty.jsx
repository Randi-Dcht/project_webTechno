import {Table} from "react-bootstrap";
import {
    getListCoure,
    getListCourseStudent,
    getListFaculty,
    getListTeacher,
    getStudentInFaculty
} from "../../utils/api.js";
import {useQuery} from "@tanstack/react-query";
import {useMemo} from "react";
import {useParams} from "react-router-dom";

const ListStudentInFaculty = ({myId}) =>
{

   const {data, isLoading} = useQuery(
       {
           queryKey: ['facultyStudent'],
           queryFn: () => getStudentInFaculty(myId),
       });

   const lineTab = useMemo(() =>
   {
       return data?.map(std =>
       {
           return(
               <tr key={std.matricule}>
                   <td>{std.matricule}</td>
                   <td><a href={"mailto:" + std.mail}>{std.name}</a></td>
               </tr>
           )
       })
   }, [data])


    return(
        /*isLoading?
            <p>Chargement ...</p>:*/
        <Table>
            <thead>
            <tr>
                <td>Matricule</td><td>Etudiant</td>
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
export default ListStudentInFaculty