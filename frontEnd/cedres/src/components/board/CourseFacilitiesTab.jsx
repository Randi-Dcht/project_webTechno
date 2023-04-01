import {Table} from "react-bootstrap";
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

   const lineTab = useMemo(() =>
   {
       console.log(data)
       let before = ""
       return data?.map(doc =>
       {
           return(
               <tr key={doc.id_aa}>
                   <td>{doc.id_aa}</td>
                   <td>{doc.name}</td>
                   <td title={doc.description}>{doc.facilities}</td>
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