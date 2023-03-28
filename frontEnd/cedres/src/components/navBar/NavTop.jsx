import {Container, Nav, Navbar} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

const NavTop = ({who}) =>
{
    const navigate = useNavigate();

    const list_url = who.Url
    const name = who.Name
    const root_url = who.Root


    return(
        <Navbar className="navTop" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand onClick={() => navigate(root_url)}>{name}</Navbar.Brand>
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