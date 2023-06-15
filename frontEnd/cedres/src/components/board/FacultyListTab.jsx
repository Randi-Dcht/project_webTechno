import {Table} from "react-bootstrap";
import {getListCoure, getListCourseStudent, getListFaculty} from "../../utils/api.js";
import {useQuery} from "@tanstack/react-query";
import {useMemo} from "react";

const CourseListTab = () =>
{

   const {data, isLoading} = useQuery(
       {
           queryKey: ['listFaculty'], 
           queryFn: getListFaculty,
       });

   const lineTab = useMemo(() =>
   {
       return data?.map(faculty =>
       {
           return(
               <tr key={faculty.id}>
                   <td>{faculty.id}</td>
                   <td>{faculty.name}</td>
                   <td><a href={"mailto:" + faculty.mail}>{faculty.mail}</a></td>
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
                <td>Id</td><td>Nom faculté</td><td>Mail</td>
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