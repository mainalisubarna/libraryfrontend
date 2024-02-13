import { Box, Button, Center, Heading, Link, Text } from "@chakra-ui/react";

const ErrorBoundaryPage = () => {
  return (
    <Center height="100vh" flexDirection="column" bg="white">
      <Box
        textAlign="center"
        bg="white"
        p={8}
        rounded="md"
        shadow="lg"
        maxWidth="500px"
      >
        <Heading fontSize="4xl" mb={4} color="blue.500">
          Oops, something went wrong!
        </Heading>
        <Text fontSize="lg" mb={6} color="gray.600">
          Please refresh this page to continue.
        </Text>
        <Button
          colorScheme="blue"
          size="lg"
          onClick={() => window.location.reload()}
        >
          Refresh
        </Button>
      </Box>
      <Box mt={8}>
        <Text fontSize="md" color="gray.500">
          &copy; Aroma | Developed by{" "}
          <Link
            color={"blue.400"}
            href="https://www.facebook.com/Mainali.Ji.Chitwan"
          >
            Subarna Mainali
          </Link>
        </Text>
      </Box>
    </Center>
  );
};

export default ErrorBoundaryPage;
