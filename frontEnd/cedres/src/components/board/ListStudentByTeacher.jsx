import {Table} from "react-bootstrap";
import {
    getListCoure,
    getListCourseStudent,
    getListFaculty, getListStudentByTeacher,
    getListTeacher,
    getStudentInFaculty
} from "../../utils/api.js";
import {useQuery} from "@tanstack/react-query";
import {useMemo} from "react";
import {useParams} from "react-router-dom";

const ListFacilities = ({list}) =>
{
    return(
        <div key={list.name}>
            {
                list?.map((e, index)=>{
                    return(
                        <p key={index}>{e.name}({e.description})</p>
                    )
                })
            }
        </div>
    )
}


const ListStudentByTeacher = ({myId}) =>
{

   const {data, isLoading} = useQuery(
       {
           queryKey: ['teacherStudent'],
           queryFn: () => getListStudentByTeacher(myId),
       });

   const lineTab = useMemo(() =>
   {
       return data?.map(std =>
       {
           return(
               <tr key={std.matricule}>
                   <td>{std.matricule}</td>
                   <td><a href={"mailto:" + std.mail}>{std.name}</a></td>
                   <td>
                       <ListFacilities list={std.listing}/>
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
                <td>Matricule</td><td>Etudiant</td><td>Liste aménagements</td>
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
export default ListStudentByTeacher