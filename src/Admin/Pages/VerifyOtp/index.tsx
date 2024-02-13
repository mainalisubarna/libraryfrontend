import { Formik, useFormikContext } from "formik";
import {
  Center,
  Heading,
  Button,
  FormControl,
  Flex,
  Stack,
  useColorModeValue,
  PinInputField,
  PinInput,
  HStack,
} from "@chakra-ui/react";
import { POST_API } from "../../../Service/Axios/Api.service";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const isUserEmailVerified = sessionStorage.getItem("isUserEmailVerified");
  return (
    <>
      {isUserEmailVerified === "true" ? (
        <Formik
          initialValues={{ pin: ["", "", "", ""] }}
          onSubmit={async (values) => {
            const otpToken = values.pin.join("");
            const email = sessionStorage.getItem("email");
            const id = sessionStorage.getItem("id");
            const data = {
              otpToken,
              email,
              id,
            };
            const response = await POST_API("students/verifyOTP", data);
            if (response.status) {
              toast.success(response.message);
              sessionStorage.removeItem("isUserEmailVerified");
              sessionStorage.setItem("isOTPVerified", "true");
              navigate("/newPassword");
            } else {
              toast.error(response.message);
            }
          }}
        >
          <FormContent />
        </Formik>
      ) : (
        <Navigate to={"/PageNotFound"} />
      )}
    </>
  );
}

function FormContent() {
  const formik: any = useFormikContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = (index: any, value: any) => {
    // Copy the current array of pin values
    const newPinValues = [...formik.values.pin];
    // Update the value at the specified index
    newPinValues[index] = value;
    // Update the form state with the new pin values
    formik.setFieldValue("pin", newPinValues);
  };

  const handleSubmit = (event: any) => {
    setIsSubmitting(true);
    event.preventDefault();
    formik.handleSubmit();
    setIsSubmitting(false);
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack
        spacing={4}
        w={"full"}
        maxW={"sm"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={10}
      >
        <Center>
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
            Verify your Email
          </Heading>
        </Center>
        <Center
          fontSize={{ base: "sm", sm: "md" }}
          color={useColorModeValue("gray.800", "gray.400")}
        >
          We have sent code to your email
        </Center>
        <Center
          fontSize={{ base: "sm", sm: "md" }}
          fontWeight="bold"
          color={useColorModeValue("gray.800", "gray.400")}
        >
          {sessionStorage.getItem("email")}
        </Center>
        <FormControl>
          <Center>
            <HStack>
              <PinInput>
                {[0, 1, 2, 3].map((index) => (
                  <PinInputField
                    key={index}
                    name={`pin.${index}`}
                    type="number"
                    onChange={(e) => handleChange(index, e.target.value)}
                  />
                ))}
              </PinInput>
            </HStack>
          </Center>
        </FormControl>
        <Stack spacing={6}>
          <Button
            bg={"blue.400"}
            color={"white"}
            _hover={{
              bg: "blue.500",
            }}
            onClick={handleSubmit}
            isLoading={isSubmitting}
            loadingText="Verifying OTP"
          >
            Verify
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}
