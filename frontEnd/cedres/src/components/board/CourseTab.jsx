import {Button, Table} from "react-bootstrap";
import {getListCourseStudent, postSuccessCourse} from "../../utils/api.js";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import React, {useCallback, useMemo} from "react";

const ActionButton = ({id}) =>
{
    const client = useQueryClient();

    const mutation = useMutation({
        mutationFn: postSuccessCourse,
        onSuccess: async data => {
            await client.invalidateQueries(['listCourse']);
        }
    });


    const onSubmit = useCallback(() => {
        mutation.mutate({
            'id': id
        });
    }, [mutation]);

    return(
        <Button style={{marginLeft:'5px'}} onClick={()=>onSubmit()} variant={"warning"}>Réussi</Button>
    )
}

const CourseTab = ({student}) =>
{

   const {data, isLoading} = useQuery(
       {
           queryKey: ['listCourse'],
           queryFn: () => getListCourseStudent(student)
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
                           doc.isSuccess === "false" ? <ActionButton id={doc.id}/>:<p>oui</p>
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