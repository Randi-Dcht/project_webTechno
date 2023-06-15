import {Button, Table} from "react-bootstrap";
import {getListCourseFacilitiesStudent, getListCourseStudent} from "../../utils/api.js";
import {useQuery} from "@tanstack/react-query";
import {useMemo} from "react";

const CourseFacilitiesTab = ({student}) =>
{

   const {data, isLoading} = useQuery(
       {
           queryKey: ['listCourseFacilities'],
           queryFn: () => getListCourseFacilitiesStudent(student)
       });

   const facilities = (list, index1) =>
   {
       return list?.map((e, index) =>
       {
           return(
               <div key={index1 + index} className='container-fluid'>
                   <div title={e.description}>
                       {e.name}
                   </div>
               </div>
           )
       })
   }

   const lineTab = useMemo(() =>
   {
       let before = ""
       return data?.map(doc =>
       {
           return(
               <tr key={doc.id}>
                   <td>{doc.id}</td>
                   <td>{doc.name}</td>
                   <td>
                       {
                         facilities(doc.facilities, doc.id)
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
                <td>A.A</td><td>Intitulé du cours</td><td>Aménagement</td>
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
export default CourseFacilitiesTab