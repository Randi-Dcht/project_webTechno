import {useQuery} from "@tanstack/react-query";
import {getListStudent} from "../../utils/api.js";
import {useMemo} from "react";
import {Table} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

const StudentsList = () =>
{

    const navigate = useNavigate();

    const {data, isLoading} = useQuery(
        {
            queryKey: ['studentList'],
            queryFn: getListStudent,
        });

    const lineTab = useMemo(() =>
    {
        return data?.map(student =>
        {
            return(
                <tr key={student.matricule}>
                    <td>{student.name} {student.surname}</td>
                    <td>{student.email}</td>
                    <td>{student.phone}</td>
                    <td><button>profile</button></td>
                </tr>
            )
        })
    }, [data])


    return(
        <div>
            <h1 style={{color: "red"}}>Liste des étudiants :</h1>
            <button onClick={()=> navigate('./add')}>ajouter</button>
            <Table>
                <thead>
                <tr>
                    <td>Nom</td><td>Mail</td><td>Gsm</td><td></td>
                </tr>
                </thead>
                <tbody>
                {
                    lineTab
                }
                </tbody>
            </Table>
        </div>
    )
}

export default StudentsList