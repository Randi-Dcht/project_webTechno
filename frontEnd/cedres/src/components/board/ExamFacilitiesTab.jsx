import {Button, Table} from "react-bootstrap";
import {getListCourseFacilitiesStudent, getListCourseStudent, getListExamFacilitiesStudent} from "../../utils/api.js";
import {useQuery} from "@tanstack/react-query";
import {useMemo} from "react";

const ExamFacilitiesTab = ({session, Ukey}) =>
{

   const {data, isLoading} = useQuery(
       {
           queryKey: [Ukey],
           queryFn: () => getListExamFacilitiesStudent(localStorage.getItem('id'), session)
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
       console.log(data)
       let before = ""
       return data?.map(doc =>
       {
           return(
               <tr key={doc.id}>
                   <td>{doc.course}</td>
                   <td>{doc.date} : {doc.hour}</td>
                   <td>{doc.local}</td>
                   <td>{doc.type}</td>
                   <td>
                       {
                         facilities(doc.facilities, doc.id)
                       }
                   </td>
                   <td>
                       <Button variant='light'>modifier</Button>
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
                <td>Cours</td><td>date</td><td>local</td><td>type</td><td>Aménagement</td><td></td>
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
export default ExamFacilitiesTab