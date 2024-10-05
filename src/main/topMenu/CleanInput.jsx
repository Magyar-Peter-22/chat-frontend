import TextField from '@mui/material/TextField';
import { Controller } from "react-hook-form";

//an input field that removes the illegal linebreaks from the text while typing
//configured for react-hook-form
export default ({fieldProps,controlProps}) => {
    return (
        <Controller
            render={({
                field: { onChange, onBlur, value, name, ref },
            }) =>
                <TextField
                    value={value}
                    onChange={(e) => {
                        //remove spaces from the start and double spaces
                        e.target.value = e.target.value.replace(/^\s+| (?= )/g, "")
                        onChange(e);
                    }} // send value to hook form
                    onBlur={onBlur} // notify when input is touched
                    inputRef={ref} // wire up the input ref
                    name={name}
                    {...fieldProps}
                />
            }
            {...controlProps}
        />
    );
}