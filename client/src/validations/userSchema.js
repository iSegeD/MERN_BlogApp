import * as yup from "yup";

// Helper: turns empty strings into undefined so Yup ignores them
// This means optional fields won't trigger validation if left empty
// If the user types something, Yup will validate the value normally
const yupIgnoreEmptyFields = (schema) => {
  return schema
    .trim()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .notRequired();
};

export const editUserSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Required field")
    .min(3, "Full name must be at least 3 characters"),

  username: yup
    .string()
    .trim()
    .required("Required field")
    .min(3, "Username must be at least 3 characters"),

  email: yup
    .string()
    .trim()
    .required("Required field")
    .email("Email format is not valid"),

  // OPTIONAL (passwords)
  currentPassword: yupIgnoreEmptyFields(
    yup.string().min(6, "Password must be at least 6 characters")
  ),

  newPassword: yupIgnoreEmptyFields(
    yup.string().min(6, "New password must be at least 6 characters")
  ),

  confirmPassword: yupIgnoreEmptyFields(
    yup.string().oneOf([yup.ref("newPassword")], "Passwords must match")
  ),
});
