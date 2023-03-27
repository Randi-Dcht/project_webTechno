import {Form} from "react-bootstrap";
import {Controller} from "react-hook-form";

export const Input = ({name, label, control, type}) =>
{
    return (
        <Controller
            name={name}
            control={control}
            render={({field, fieldState}) =>
            {
                return (<Form.Group>
                    <Form.Label>{label}</Form.Label>
                    <Form.Control type={type} value={field.value} onChange={field.onChange}/>
                    <p style={{color: 'red'}}>{fieldState.error?.message}</p>
                </Form.Group>)
            }}
        />
    );
}