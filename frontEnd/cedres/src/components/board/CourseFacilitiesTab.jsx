import {Button, Table} from "react-bootstrap";
import {getListCourseFacilitiesStudent, getListCourseStudent} from "../../utils/api.js";
import {useQuery} from "@tanstack/react-query";
import {useMemo} from "react";

const CourseFacilitiesTab = () =>
{

   const {data, isLoading} = useQuery(
       {
           queryKey: ['listCourseFacilities'],
           queryFn: () => getListCourseFacilitiesStudent(localStorage.getItem('id'))
       });

   const facilities = (list, index1) =>
   {
       return list?.map((e, index) =>
       {
           return(
               <div key={index1 + index} className='container-fluid'>
                   <div title={e.description}>
                       {e.name}
                       <Button variant='light' className='m-2'>retirer</Button>
                   </div>
               </div>
           )
       })
   }

   const lineTab = useMemo(() =>
   {
       console.log(data)
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
            <p>en chargement ...</p>:*/
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