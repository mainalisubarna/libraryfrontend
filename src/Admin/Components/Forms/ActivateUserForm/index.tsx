import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, FormikHelpers } from "formik";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  Center,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { POST_API } from "../../../../Service/Axios/Api.service";
import { toast } from "react-toastify";

interface FormValues {
  email: string;
}

const ActivateUserForm: React.FC = () => {
  const navigate = useNavigate();

  const initialValues: FormValues = {
    email: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const handleSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    let url;
    if (sessionStorage.getItem("type") === "activateAccount") {
      url = "students/verify";
    } else {
      url = "students/forgotPassword";
    }
    const response: any = await POST_API(url, values);
    if (response.status) {
      toast.success(response.message);
      sessionStorage.removeItem("type");
      sessionStorage.setItem("email", response.data.Email);
      sessionStorage.setItem("id", response.data.Student_Id);
      sessionStorage.setItem("isUserEmailVerified", "true");
      navigate("/verify-otp");
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
                >
                  <FormLabel>Email</FormLabel>
                  <Input
                    {...field}
                    type="email"
                    placeholder="your-email@example.com"
                  />
                  <FormErrorMessage>{form.errors.email}</FormErrorMessage>
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
              loadingText="Sending OTP"
            >
              Request OTP
            </Button>
          </Center>
        </Form>
      )}
    </Formik>
  );
};

export default ActivateUserForm;
