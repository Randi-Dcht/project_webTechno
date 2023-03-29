import {useQuery} from "@tanstack/react-query";
import {getListTeacher} from "./api.js";

const createListCourse = () =>
{
    const {data, isLoading} = useQuery(
        {
            queryKey: ['listCourseSingle'],
            queryFn: getListTeacher,
            onSuccess: async data =>
            {

            }
        });
}
export default createListCourse