import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Image,
} from "@chakra-ui/react";

import {
  FiHome,
  FiSettings,
  FiMenu,
  FiChevronDown,
  FiUsers,
  FiFileText,
  FiTrello,
  FiShoppingBag,
} from "react-icons/fi";
import { IconType } from "react-icons";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../Footer";
import { logout } from "../../../Slice/AuthSlice";

interface LinkItemProps {
  name: string;
  icon: IconType;
}

export default function SidebarWithHeader() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minHeight="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4" minHeight="82.5vh" bg={"white"}>
        {<Outlet />}
      </Box>
      <Footer />
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const { Role } = useSelector((state: any) => state.userDetails);
  let redirect: string;
  if (Role === "admin") {
    redirect = "";
  } else {
    redirect = "/student/";
  }
  const navigate = useNavigate();

  let LinkItems: Array<LinkItemProps>;
  if (Role === "admin") {
    LinkItems = [
      { name: "Dashboard", icon: FiHome },
      { name: "Students", icon: FiUsers },
      { name: "Books", icon: FiFileText },
      { name: "Transactions", icon: FiTrello },
      { name: "Billings", icon: FiShoppingBag },
      { name: "Settings", icon: FiSettings },
    ];
  } else {
    LinkItems = [
      { name: "Dashboard", icon: FiHome },
      { name: "Books", icon: FiFileText },
      { name: "Transactions", icon: FiTrello },
      { name: "Billings", icon: FiShoppingBag },
      { name: "Settings", icon: FiSettings },
    ];
  }
  return (
    <>
      <Box
        transition="3s ease"
        bg={useColorModeValue("white", "gray.900")}
        borderRight="1px"
        borderRightColor={useColorModeValue("gray.200", "gray.700")}
        w={{ base: "full", md: 60 }}
        pos="fixed"
        h="full"
        {...rest}
      >
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
          <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
            <Image
              mx="1vw"
              boxSize="80px"
              objectFit="contain"
              src="https://mlkrboy28jby.i.optimole.com/w:auto/h:auto/q:mauto/f:avif/https://www.aromaschool.edu.np/wp-content/uploads/2020/09/aroma_logo_final.png"
              alt="Logo"
            />
          </Text>
          <CloseButton
            display={{ base: "flex", md: "none" }}
            onClick={onClose}
          />
        </Flex>
        {LinkItems.map((link) => (
          <NavItem
            key={link.name}
            icon={link.icon}
            onClick={() => navigate(redirect + link.name.toLowerCase())}
          >
            {link.name}
          </NavItem>
        ))}
      </Box>
    </>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: any;
}
const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Flex
      align="center"
      p="4"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      _hover={{
        bg: "blue.400",
        color: "white",
      }}
      {...rest}
    >
      {icon && (
        <Icon
          mr="4"
          fontSize="16"
          _groupHover={{
            color: "white",
          }}
          as={icon}
        />
      )}
      {children}
    </Flex>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { First_Name, Last_Name, photo, Role } = useSelector(
    (state: any) => state.userDetails
  );
  let redirect: string;
  if (Role === "admin") {
    redirect = "";
  } else {
    redirect = "/student";
  }
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="20px"
        fontFamily="monospace"
        fontWeight="bold"
      >
        Aroma Mobile Library
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar
                  size={"sm"}
                  src={
                    photo ? photo : "https://meet-plus.com/img/icons/avatar.svg"
                  }
                />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{First_Name + " " + Last_Name}</Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue("white", "gray.900")}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              <MenuItem onClick={() => navigate(redirect + "/settings")}>
                Profile
              </MenuItem>
              <MenuItem onClick={() => navigate(redirect + "/settings")}>
                Settings
              </MenuItem>
              <MenuItem onClick={() => navigate(redirect + "/billings")}>
                Billings
              </MenuItem>
              <MenuItem
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(logout());
                  window.location.reload();
                  window.location.href = "/";
                }}
              >
                Sign out
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};
