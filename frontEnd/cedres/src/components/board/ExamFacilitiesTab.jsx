import {Button, Table} from "react-bootstrap";
import {
    getListCourseFacilitiesStudent,
    getListCourseStudent,
    getListExamFacilitiesStudent,
    postAskFacilitiesExamen, postUpdateStatusExam
} from "../../utils/api.js";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useCallback, useMemo} from "react";
import {useNavigate} from "react-router-dom";
import {STUDENT} from "../../utils/routes.js";


const ButtonValide = ({id}) =>
{
    const client = useQueryClient();

    const mutation = useMutation({
        mutationFn: postUpdateStatusExam,
        onSuccess: async data => {
            await client.invalidateQueries(['buttonValidate']);
        }
    });


    const onSubmit = useCallback(() => {
        mutation.mutate({
            'id': id,
            'status': 'tovalide'
        });
    }, [mutation]);

    return(
        <Button style={{marginLeft:'15px'}} onClick={()=>onSubmit()} variant='danger'>valider</Button>
    )
}

const ExamFacilitiesTab = ({session, Ukey, showButton}) =>
{
    const navigate = useNavigate();

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
                   <td>{doc.locale}</td>
                   <td>{doc.type}</td>
                   <td>
                       {
                         facilities(doc.facilities, doc.id)
                       }
                   </td>
                   <td>
                       {showButton && doc.status==="create" && <Button variant='warning' onClick={() => navigate(STUDENT+'/ask-exam/'+doc.id)}>Modifier</Button>}
                       {doc.status==="update" && <Button variant='warning' onClick={() => navigate(STUDENT+'/ask-exam/'+doc.id)}>Modifier</Button>}
                       {showButton && doc.status==="create" && <ButtonValide id={doc.id}/>}
                       {doc.status==="update" && <ButtonValide id={doc.id}/>}
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
                <td>Cours</td><td>Date</td><td>Local</td><td>Type</td><td>Aménagement</td><td></td>
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