import * as yup from "yup";

export const registerSchema = yup.object().shape({
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
    .required("Required field")
    .email("Email format is not valid"),
  password: yup
    .string()
    .trim()
    .required("Required field")
    .min(6, "Password must be at least 6 characters"),
});

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .required("Required field")
    .email("Email format is not valid"),

  password: yup
    .string()
    .trim()
    .required("Required field")
    .min(6, "Password must be at least 6 characters"),
});
