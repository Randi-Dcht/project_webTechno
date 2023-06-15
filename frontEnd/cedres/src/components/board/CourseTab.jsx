import {Button, Table} from "react-bootstrap";
import {getListCourseStudent} from "../../utils/api.js";
import {useQuery} from "@tanstack/react-query";
import React, {useMemo} from "react";

const CourseTab = () =>
{

   const {data, isLoading} = useQuery(
       {
           queryKey: ['listCourse'],
           queryFn: () => getListCourseStudent(localStorage.getItem('id'))
       });

   const lineTab = useMemo(() =>
   {
       return data?.map(doc =>
       {
           return(
               <tr key={doc.id_aa}>
                   <td>{doc.id_aa}</td>
                   <td>{doc.name}</td>
                   <td>{doc.quadrimester}</td>
                   <td><a href={"mailto:" + doc.mail}>{doc.teacher}</a></td>
                   <td>
                       {
                           doc.isSuccess === "false" ? <Button>Réussi</Button>:<p>oui</p>
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
                <td>A.A</td><td>Intitulé du cours</td><td>Quadrimestre</td><td>Professeur</td><td>Réussi ?</td>
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
export default CourseTab