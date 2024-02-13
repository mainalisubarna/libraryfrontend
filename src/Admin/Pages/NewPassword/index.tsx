import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Navigate, useNavigate } from "react-router-dom";
import { POST_API } from "../../../Service/Axios/Api.service";
import { toast } from "react-toastify";

interface FormValues {
  password: string;
  confirmPassword: string;
}

const validationSchema = Yup.object({
  password: Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
    ),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"), // Explicit casting here
});

export default function NewPassword() {
  const navigate = useNavigate();
  const isOTPVerified = sessionStorage.getItem("isOTPVerified");
  const id = sessionStorage.getItem("id");
  const handleSubmit = async (values: FormValues, actions: any) => {
    let data = {
      password: values.password,
      id,
    };
    const response = await POST_API("/students/newPassword", data);
    if (response.status) {
      toast.success(response.message);
      sessionStorage.removeItem("isOTPVerified");
      sessionStorage.removeItem("id");
      sessionStorage.removeItem("email");
      navigate("/login");
    } else {
      toast.error(response.message);
    }
    actions.setSubmitting(false);
  };
  return (
    <>
      {isOTPVerified ? (
        <Flex
          minH={"100vh"}
          align={"center"}
          justify={"center"}
          bg={useColorModeValue("gray.50", "gray.800")}
        >
          <Formik
            initialValues={{
              password: "",
              confirmPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }: any) => (
              <Form>
                <Stack
                  spacing={4}
                  w={"full"}
                  maxW={"md"}
                  bg={useColorModeValue("white", "gray.700")}
                  rounded={"xl"}
                  boxShadow={"lg"}
                  p={6}
                  my={12}
                >
                  <Heading
                    lineHeight={1.1}
                    fontSize={{ base: "2xl", md: "3xl" }}
                  >
                    Enter new password
                  </Heading>
                  <Field name="password">
                    {({ field, form }: any) => (
                      <FormControl
                        id="password"
                        isInvalid={
                          form.errors.password && form.touched.password
                        }
                      >
                        <FormLabel>Password</FormLabel>
                        <Input
                          {...field}
                          placeholder="Password"
                          _placeholder={{ color: "gray.500" }}
                          type="password"
                        />
                        <FormErrorMessage>
                          {form.errors.password}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="confirmPassword">
                    {({ field, form }: any) => (
                      <FormControl
                        id="confirm-password"
                        isInvalid={
                          form.errors.confirmPassword &&
                          form.touched.confirmPassword
                        }
                      >
                        <FormLabel>Confirm Password</FormLabel>
                        <Input
                          {...field}
                          placeholder="Confirm Password"
                          type="password"
                        />
                        <FormErrorMessage>
                          {form.errors.confirmPassword}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Stack spacing={6}>
                    <Button
                      type="submit"
                      bg={"blue.400"}
                      color={"white"}
                      _hover={{
                        bg: "blue.500",
                      }}
                      isLoading={isSubmitting}
                      loadingText={"Activating the Account"}
                    >
                      Submit
                    </Button>
                  </Stack>
                </Stack>
              </Form>
            )}
          </Formik>
        </Flex>
      ) : (
        <Navigate to={"/PageNotFound"} />
      )}
    </>
  );
}
