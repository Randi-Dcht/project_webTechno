import {Table} from "react-bootstrap";
import {getListCoure, getListCourseStudent, getListFaculty, getListTeacher} from "../../utils/api.js";
import {useQuery} from "@tanstack/react-query";
import {useMemo} from "react";

const CourseListTab = () =>
{

   const {data, isLoading} = useQuery(
       {
           queryKey: ['listTeacher'],
           queryFn: getListTeacher,
       });

   const lineTab = useMemo(() =>
   {
       return data?.map(prof =>
       {
           return(
               <tr key={prof.id}>
                   <td>{prof.name + " " + prof.surname}</td>
                   <td><a href={"mailto:" + prof.email}>{prof.email}</a></td>
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
                <td>Professeur</td><td>Mail</td>
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
export default CourseListTab