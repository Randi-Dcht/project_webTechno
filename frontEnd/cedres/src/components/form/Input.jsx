import {Form} from "react-bootstrap";
import {Controller} from "react-hook-form";

export const Input = ({name, label, control, type, ...props}) =>
{
    return (
        <Controller
            name={name}
            control={control}
            render={({field, fieldState}) =>
            {
                return <Form.Group>
                    <Form.Label>{label}</Form.Label>
                    <Form.Control type={type} value={field.value} onChange={field.onChange} {...props} />
                    <p style={{color: 'red'}}>{fieldState.error?.message}</p>
                </Form.Group>
            }}
        />
    );
}