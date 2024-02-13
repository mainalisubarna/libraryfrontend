import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, FormikHelpers } from "formik";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  InputGroup,
  InputRightElement,
  FormErrorMessage,
  Center,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { POST_API } from "../../../../Service/Axios/Api.service";
import { useDispatch } from "react-redux";
import { login } from "../../../../Slice/AuthSlice";
import { userDetails } from "../../../../Slice/UserDetailSlice";
import { toast } from "react-toastify";

interface FormValues {
  email: string;
  password: string;
  role: string;
}

const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const initialValues: FormValues = {
    email: "",
    password: "",
    role: "admin",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
    role: Yup.string()
      .required("Role is required")
      .oneOf(["admin", "student"], "Invalid role"),
  });

  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    let url;
    let Role;
    let redirect;
    if (values.role === "admin") {
      url = "login";
      Role = "admin";
      redirect = "/dashboard";
    } else {
      url = "students/login";
      Role = "student";
      redirect = "/student/dashboard";
    }
    const response: any = await POST_API(url, values);
    if (response.status) {
      dispatch(login(response.jwtToken));
      dispatch(userDetails({ ...response.data, Role }));
      navigate(redirect);
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
    actions.setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <Center mb={4}>
            <Field name="email">
              {({ field, form }: any) => (
                <FormControl
                  isInvalid={form.errors.email && form.touched.email}
                  isRequired
                >
                  <FormLabel>Email</FormLabel>
                  <Input {...field} type="email" placeholder="Email" />
                  <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
          </Center>

          <Center mb={4}>
            <Field name="password">
              {({ field, form }: any) => (
                <FormControl
                  isInvalid={form.errors.password && form.touched.password}
                  isRequired
                >
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                    />
                    <InputRightElement width="4.5rem">
                      <Button size="sm" onClick={handlePasswordVisibility}>
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
          </Center>

          <Center>
            <Field name="role">
              {({ field, form }: any) => (
                <FormControl
                  isInvalid={form.errors.role && form.touched.role}
                  isRequired
                >
                  <FormLabel>Role</FormLabel>
                  <Select {...field} placeholder="Select role">
                    <option value="admin">Admin</option>
                    <option value="student">Student</option>
                  </Select>
                  <FormErrorMessage>{form.errors.role}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
          </Center>

          <Center mt={6}>
            <Button
              type="submit"
              colorScheme="blue"
              variant="solid"
              isLoading={isSubmitting}
              loadingText="Logging You"
            >
              Sign In
            </Button>
          </Center>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
