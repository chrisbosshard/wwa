import React from "react";
import TextField from "@mui/material/TextField";

type TextFieldProps = {
  label: string;
  multiline?: boolean;
  className?: string;
  rows?: number;
};

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Field = React.forwardRef<HTMLInputElement, TextFieldProps>(({ className, label, multiline, rows, ...props }, ref) => {
  return (
    <TextField
      inputRef={ref}
      label={label}
      variant="outlined"
      fullWidth
      multiline={multiline}
      rows={rows}
      sx={{
        input: {
          borderColor: "#ebdcbe",
          color: "#ebdcbe",
        },
      }}
      {...props}
    />
  );
});

// 👇️ set display name
Field.displayName = "Field";
