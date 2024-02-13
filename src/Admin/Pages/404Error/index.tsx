import {
  Box,
  Heading,
  Text,
  Button,
  useColorModeValue,
  Container,
  Center,
  Link,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  let redirect: any;
  const { Role } = useSelector((state: any) => state.userDetails);
  if (Role === "admin") {
    redirect = "dashboard";
  } else {
    redirect = "student/dashboard";
  }
  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading
        display="inline-block"
        as="h2"
        size="2xl"
        bgGradient="linear(to-r, blue.400, blue.600)"
        backgroundClip="text"
      >
        404
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        Page Not Found
      </Text>
      <Text color={"gray.500"} mb={6}>
        The page you're looking for does not seem to exist
      </Text>

      <Button
        colorScheme="blue"
        bgGradient="linear(to-r, blue.400, blue.500, blue.600)"
        color="white"
        variant="solid"
        onClick={() => navigate(redirect)}
      >
        Go to Home
      </Button>
      <Box
        bg={useColorModeValue("gray.50", "gray.900")}
        color={useColorModeValue("gray.900", "gray.100")}
      >
        <Container maxW={"4xl"} py={3} marginTop="60vh">
          <Center>
            <Text>
              © 2023 Aroma. Developed by{" "}
              <Link
                color={"blue.400"}
                href="https://www.facebook.com/Mainali.Ji.Chitwan"
              >
                Subarna Mainali
              </Link>
            </Text>
          </Center>
        </Container>
      </Box>
    </Box>
  );
}
