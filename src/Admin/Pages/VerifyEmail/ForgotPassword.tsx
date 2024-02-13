import {
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import ActivateUserForm from "../../Components/Forms/ActivateUserForm";
import { Navigate } from "react-router-dom";

export default function VerifyEmailForgotPassword() {
  const type = sessionStorage.getItem("type");
  return (
    <>
      {type === "forgotPassword" ? (
        <Flex
          minH={"100vh"}
          align={"center"}
          justify={"center"}
          bg={useColorModeValue("gray.50", "gray.800")}
        >
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
            <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
              Forgot Password Account?
            </Heading>
            <Text
              fontSize={{ base: "sm", sm: "md" }}
              color={useColorModeValue("gray.800", "gray.400")}
            >
              You&apos;ll get an email with a OTP.
            </Text>
            <ActivateUserForm />
          </Stack>
        </Flex>
      ) : (
        <Navigate to={"/login"} />
      )}
    </>
  );
}
