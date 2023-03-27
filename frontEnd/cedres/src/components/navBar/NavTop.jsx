import {Container, Nav, Navbar} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

const NavTop = ({list_url, name}) =>
{
    const navigate = useNavigate();

    return(
        <Navbar className="navTop" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand onClick={() => navigate('/')}>{name}</Navbar.Brand>
                <Nav className="me-auto">
                    {
                        list_url.map(item =>
                        {
                            return(
                                <Nav.Link key={item.name} onClick={() => navigate(item.url)}>{item.name}</Nav.Link>
                            )
                        })
                    }
                </Nav>
            </Container>
        </Navbar>
    )
}
export default NavTop;