import {useQuery} from "@tanstack/react-query";
import {getListTeacher} from "../../utils/api.js";
import {Container} from "react-bootstrap";

const Courses = () =>
{

    const {data, isLoading} = useQuery(
    {
        queryKey: ['listTeacher'],
        queryFn: getListTeacher
    })

    return(
        <Container>
            <h3 className="m-2">Mes cours : </h3>
        </Container>
    )
}

export default Courses;