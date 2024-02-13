import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  POST_API_JWT,
  POST_API_JWT_FORMDATA,
} from "../../../Service/Axios/Api.service";
import { GET_JWT_TOKEN } from "../../../Service/GetJWT";
import { toast } from "react-toastify";
import { userDetails } from "../../../Slice/UserDetailSlice";

export default function Settings() {
  const dispatch = useDispatch();
  const { Student_ID, User_Id, First_Name, Last_Name, Email, photo, Role } =
    useSelector((state: any) => state.userDetails);
  const [isLoading, SetIsLoading] = useState<any>(false);
  const jwt = GET_JWT_TOKEN();
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [values, SetValues] = useState<any>({
    newPassword: "",
    currentPassword: "",
  });
  const [err, SetErr] = useState<any>(null);
  let url: string;
  let photoEdit: string;
  let Id: number;
  let response: any;
  if (Role === "student") {
    url = "students/settings/password";
    photoEdit = "students/profile/update";
    Id = Number(Student_ID);
  } else if (Role === "admin") {
    url = "user/edit/password";
    photoEdit = "user/profile/update";
    Id = Number(User_Id);
  }
  const handleSubmit = async () => {
    SetIsLoading(true);
    if (
      selectedImage !== null &&
      values.currentPassword !== "" &&
      values.newPassword !== ""
    ) {
      SetErr(null);
      const formData: any = new FormData();
      formData.append("photo", selectedImage);
      formData.append("newPassword", values.newPassword);
      formData.append("currentPassword", values.currentPassword);
      formData.append("id", Id);
      formData.append("isPhotoChanged", true);
      response = await POST_API_JWT_FORMDATA(url, formData, jwt);
    } else if (
      selectedImage !== null &&
      values.newPassword === "" &&
      values.currentPassword === ""
    ) {
      SetErr(null);
      const formData: any = new FormData();
      formData.append("photo", selectedImage);
      formData.append("id", Id);
      response = await POST_API_JWT_FORMDATA(photoEdit, formData, jwt);
    } else if (
      values.newPassword !== "" &&
      values.currentPassword !== "" &&
      selectedImage === null
    ) {
      SetErr(null);
      response = await POST_API_JWT(
        url,
        { ...values, isPhotoChanged: false, id: Id },
        jwt
      );
    } else {
      SetErr("Make a valid input");
    }
    if (response?.status) {
      toast.success(response.message);
      const data = response.data;
      dispatch(userDetails({ ...data, Role }));
      setSelectedImage(null);
    } else {
      toast.error(response?.message);
    }
    SetValues({
      newPassword: "",
      currentPassword: "",
    });

    SetIsLoading(false);
  };
  return (
    <Flex
      minH={"75vh"}
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
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
          User Profile Edit
        </Heading>
        <FormControl id="userName">
          <FormLabel>Profile</FormLabel>
          <Stack direction={["column", "row"]} spacing={6}>
            <Center>
              <Avatar
                size="xl"
                src={
                  selectedImage
                    ? URL.createObjectURL(selectedImage)
                    : photo
                    ? photo
                    : "https://meet-plus.com/img/icons/avatar.svg"
                }
              ></Avatar>
            </Center>
            <Center w="full">
              <input
                type="file"
                accept="image/*"
                onChange={(e: any) => setSelectedImage(e.target.files[0])}
                style={{ display: "none" }}
                id="fileInput"
              />
              <label htmlFor="fileInput">
                <Button
                  style={{ paddingRight: "80px", paddingLeft: "80px" }}
                  as="span"
                  w="full"
                >
                  Change Profile Pic
                </Button>
              </label>
            </Center>
          </Stack>
          <p className="text-sm mt-3 text-red-700">
            Note : No need to change password for only profile pic change but
            clear all the fields and submit.
          </p>
        </FormControl>
        <FormControl id="Name">
          <FormLabel>Name</FormLabel>
          <Input
            placeholder="Name"
            _placeholder={{ color: "gray.500" }}
            type="text"
            defaultValue={First_Name + " " + Last_Name}
            disabled
          />
        </FormControl>
        <FormControl id="Email">
          <FormLabel>Email address</FormLabel>
          <Input
            placeholder="your-email@example.com"
            _placeholder={{ color: "gray.500" }}
            type="email"
            defaultValue={Email}
            disabled
          />
        </FormControl>
        <FormControl id="oldPassword" isRequired>
          <FormLabel>Current Password</FormLabel>
          <Input
            placeholder="Current Password"
            _placeholder={{ color: "gray.500" }}
            type="password"
            value={values.currentPassword}
            name="currentPassword"
            onChange={(e: any) => {
              const newValue = {
                ...values,
                [e.target.name]: e.target.value,
              };
              SetValues(newValue);
            }}
          />
        </FormControl>
        <FormControl id="newPassword" isRequired>
          <FormLabel>New Password</FormLabel>
          <Input
            placeholder="New Password"
            _placeholder={{ color: "gray.500" }}
            type="password"
            value={values.newPassword}
            name="newPassword"
            onChange={(e: any) => {
              const newValue = {
                ...values,
                [e.target.name]: e.target.value,
              };
              SetValues(newValue);
            }}
          />
        </FormControl>
        {err ? (
          <p className="text-sm text-red-600">Make a valid input</p>
        ) : null}
        <Stack spacing={6} direction={["column", "row"]}>
          <Button
            type="submit"
            bg={"blue.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "blue.500",
            }}
            onClick={handleSubmit}
            isLoading={isLoading}
            loadingText={"Updating the details"}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}
