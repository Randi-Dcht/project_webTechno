import {Badge, ListGroup, Table} from "react-bootstrap";
import {getListCoure, getListCourseStudent, getListFaculty, getListTeacher, getLog} from "../../utils/api.js";
import {useQuery} from "@tanstack/react-query";
import {useMemo} from "react";

const LogListTab = () =>
{

   const {data, isLoading} = useQuery(
       {
           queryKey: ['log'],
           queryFn: getLog,
       });


    return(
        isLoading?
            <p>Chargement ...</p>:
            <ListGroup as="ol">
                {
                    data.map((e, index) =>
                    {
                        return(
                            <ListGroup.Item
                                style={{backgroundColor:e.type===" INFO "?'#E4F7CF':'#FCC3C3'}}
                                key={index}
                                as="li"
                                className="d-flex justify-content-between align-items-start">
                                <div className="ms-2 me-auto">
                                    {e.message}
                                </div>
                                <Badge bg="primary" pill>
                                    {e.date}
                                </Badge>
                            </ListGroup.Item>
                        )
                    })
                }
            </ListGroup>
    )
}
export default LogListTab