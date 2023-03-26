import {Controller} from "react-hook-form";
import {Form} from "react-router-dom";

const Inputs = ({name, label, controls, type}) =>
{
    return(
        <Controller
            name={name}
            control={controls}
            render=
                {({field, fieldState}) =>
                {
                    return <Form.Group>
                        <Form.Label>{label}</Form.Label>
                        <Form.Control type={type} value={field.value} onChange={field.onChange}/>
                        <p style={{color: 'red'}}>{fieldState.error?.message}</p>
                    </Form.Group>
                }}/>
    )
}

export default Inputs;