import {Button, Container} from "react-bootstrap";
import CourseTab from "../../components/board/CourseTab.jsx";
import {useState} from "react";
import CourseStudentForm from "../../components/forms/CourseStudentForm.jsx";
import {useQuery} from "@tanstack/react-query";
import {getActiveButton, getListCoure, getSelectList} from "../../utils/api.js";
import NoButton from "../../components/NoButton.jsx";

const listCourse = () =>
{
  const {data} = useQuery(
      {
          queryKey:['listCourseSingle'],
          queryFn: () => getSelectList('course'),
      })

    return data;
}

const listTeacher = () =>
{
    const {data} = useQuery(
        {
            queryKey:['listTeacherSingle'],
            queryFn: () => getSelectList('teacher'),
        })

    return data;
}

const Courses = () =>
{
    const [isAdd, setAdd] = useState(false);

    const listA = listCourse();
    const listB = listTeacher();

    const {data, isLoading} = useQuery(
        {
            queryKey:['activeButton'],
            queryFn: getActiveButton,
        })

    return(
        <Container>
            <h3 className="m-3">Mes cours : </h3>
            {
                isLoading? <p>Chargement ...</p>:
                    data.active==="course"?
                isAdd === false ?
                    <div className="container-fluid text-center"><Button className='m-3' variant="warning" onClick={()=>setAdd(true)}>Ajouter un cours</Button></div>:
                    <CourseStudentForm cancel={setAdd} listA={listA} listB={listB}/>: <NoButton/>
            }
            <CourseTab student={localStorage.getItem('id')}/>
        </Container>
    )
}

export default Courses;