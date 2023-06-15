import {Table} from "react-bootstrap";
import {getListCoure, getListCourseStudent} from "../../utils/api.js";
import {useQuery} from "@tanstack/react-query";
import {useMemo} from "react";

const CourseListTab = () =>
{

   const {data, isLoading} = useQuery(
       {
           queryKey: ['listCourse'],
           queryFn: getListCoure,
       });

   const lineTab = useMemo(() =>
   {
       return data?.map(course =>
       {
           return(
               <tr key={course.id_aa}>
                   <td>{course.id_aa}</td>
                   <td>{course.name}</td>
                   <td>{course.quadrimester}</td>
                   <td>
                       {
                           course.passExam === 8 && <p>Janvier/Aout</p>
                       }
                       {
                           course.passExam === 11 && <p>Juin/Aout</p>
                       }
                       {
                           course.passExam === 12 && <p>Janvier/Juin/Aout</p>
                       }
                   </td>
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
                <td>A.A</td><td>Intitulé du cours</td><td>Quadrimestre</td><td>Passage examen</td>
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