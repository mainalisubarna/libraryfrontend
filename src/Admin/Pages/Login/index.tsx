import {
  Flex,
  Box,
  Stack,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import LoginForm from "../../Components/Forms/LoginForm";
import Footer from "../../Components/Footer";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { isLogged, jwtToken } = useSelector((state: any) => state.auth);
  const { Role } = useSelector((state: any) => state.userDetails);
  useEffect(() => {
    if (isLogged && jwtToken && Role === "admin") {
      navigate("/dashboard");
    } else if (isLogged && jwtToken && Role === "student") {
      navigate("/student/dashboard");
    }
  }, []);

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"3xl"}>Library Management System</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            Sign In to access the resources
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <LoginForm />
          <Flex gap={"2rem"} className="mt-4">
            <Text>
              <Link
                color={"blue.400"}
                textDecoration={"none"}
                onClick={() => {
                  sessionStorage.setItem("type", "activateAccount");
                  navigate("/activate");
                }}
              >
                Activate your account
              </Link>
            </Text>
            <Text>
              <Link
                color={"blue.400"}
                textDecoration={"none"}
                onClick={() => {
                  sessionStorage.setItem("type", "forgotPassword");
                  navigate("/forgotPassword");
                }}
              >
                Forgot your password
              </Link>
            </Text>
          </Flex>
        </Box>
        <Footer />
      </Stack>
    </Flex>
  );
}
