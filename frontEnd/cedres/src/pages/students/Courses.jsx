import {Button, Container} from "react-bootstrap";
import CourseTab from "../../components/board/CourseTab.jsx";
import {useState} from "react";
import CourseStudentForm from "../../components/forms/CourseStudentForm.jsx";

const Courses = () =>
{
    const [isAdd, setAdd] = useState(false);

    return(
        <Container>
            <h3 className="m-3">Mes cours : </h3>
            {
                isAdd === false ?
                    <div className="container-fluid text-center"><Button className='m-3' variant="warning" onClick={()=>setAdd(true)}>ajouter un cours</Button></div>:
                    <CourseStudentForm cancel={setAdd}/>
            }
            <CourseTab/>
        </Container>
    )
}

export default Courses;