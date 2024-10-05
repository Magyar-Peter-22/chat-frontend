import Select from '@mui/material/Select';
import { Controller } from "react-hook-form";

export default ({ fieldProps, controlProps,children }) => {
  return (
    <Controller
      render={({
        field: { onChange, onBlur, value, name, ref },
      }) =>
        <Select
          value={value}
          onChange={onChange} // send value to hook form
          onBlur={onBlur} // notify when input is touched
          inputRef={ref} // wire up the input ref
          name={name}
          {...fieldProps}
        >
          {children}
        </Select>
      }
      {...controlProps}
    />
  );
}