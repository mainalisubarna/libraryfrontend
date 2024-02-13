import {
  Box,
  Center,
  Container,
  useColorModeValue,
  Text,
  Link,
} from "@chakra-ui/react";

const Footer = () => (
  <Box bg={"white"} color={useColorModeValue("gray.900", "gray.100")}>
    <Container maxW={"6xl"} py={4} marginBottom={2}>
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
);

export default Footer;
