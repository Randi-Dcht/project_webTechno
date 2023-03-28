import {Button, Form} from "react-bootstrap";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

const Connect = ({redirect}) =>
{
    const [isVisible, setVisible] = useState(false);
    const navigate = useNavigate()

    return(
        <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email Umons :</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Mot de passe :</Form.Label>
                <Form.Control type={isVisible?"text":"password"} placeholder="Password" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check onChange={() => setVisible(!isVisible)} type="checkbox" label="vérifier mot de passe" />
            </Form.Group>
            <Button variant="primary" type="submit" onClick={()=>navigate(redirect)}>
                connexion
            </Button>
        </Form>
    )
}
export default Connect;