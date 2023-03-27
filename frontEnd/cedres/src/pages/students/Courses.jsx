import {useQuery} from "@tanstack/react-query";
import {getListTeacher} from "../../utils/api.js";

const Courses = () =>
{

    const {data, isLoading} = useQuery(
    {
        queryKey: ['listTeacher'],
        queryFn: getListTeacher
    })

    return(
        <div>
            <h1>Mes cours : </h1>
        </div>
    )
}

export default Courses;