import {
  Button,
  Flex,
  HStack,
  IconButton,
  Image,
  useColorModeValue,
  useDisclosure,
  VStack,
  Box,
  useBreakpointValue,
} from "@chakra-ui/react"
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons"
import logo from "../../assets/react.svg"
import ColorModeSwitch from "../ColorModeSwitch"
import { Link } from "react-router-dom"
import CustomModal from "../common/layouts/CustomModal"
import LoginForm from "../auth/LoginForm"
import SignUpForm from "../auth/SignUpForm"
import useAuthStore from "../../stores/authStore"
import { useColorMode } from "@chakra-ui/react"

const NavBar = () => {
  const {
    isOpen: isLoginOpen,
    onOpen: onLoginOpen,
    onClose: onLoginClose,
  } = useDisclosure()
  const {
    isOpen: isSignUpOpen,
    onOpen: onSignUpOpen,
    onClose: onSignUpClose,
  } = useDisclosure()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { colorMode } = useColorMode()
  const { isAuthenticated, logout } = useAuthStore()
  const bg = useColorModeValue("teal.500", "gray.800")

  const showLogo = useBreakpointValue({ base: false, md: true })

  // Function to close the menu when a link is clicked
  const handleLinkClick = () => {
    if (isOpen) {
      onClose()
    }
  }

  return (
    <>
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="0.8rem"
        bg={bg}
        color="white"
        position="fixed"
        top="0"
        left="0"
        right="0"
        zIndex="1000"
      >
        <Flex align="center" mr={5} className="space-x-4">
          {showLogo ? (
            <Link to="/" className="text-lg">
              <Image src={logo} alt="React Logo" boxSize="30px" />
            </Link>
          ) : (
            <IconButton
              display={{ base: "block", md: "none" }}
              onClick={isOpen ? onClose : onOpen}
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              variant="outline"
              aria-label="Open Menu"
            />
          )}
        </Flex>

        <HStack
          display={{ base: "none", md: "flex" }}
          align="center"
          spacing={4}
          className="space-x-4"
          mr="auto"
        >
          {isAuthenticated && (
            <Link to="/backtest" className="text-lg">
              Charts
            </Link>
          )}
          <Link to="/coins" className="text-lg">
            Market Data
          </Link>

        </HStack>

        <Flex align="center">
          <ColorModeSwitch />
          {!isAuthenticated && (
            <>
              <Button onClick={onLoginOpen} colorScheme="teal" ml={5}>
                Login
              </Button>
              <CustomModal
                isOpen={isLoginOpen}
                title="Login"
                onClose={onLoginClose}
              >
                <LoginForm onClose={onLoginClose} />
              </CustomModal>
              <Button onClick={onSignUpOpen} colorScheme="teal">
                Sign up
              </Button>
              <CustomModal
                isOpen={isSignUpOpen}
                onClose={onSignUpClose}
                title="Create Account"
              >
                <SignUpForm onClose={onSignUpClose} />
              </CustomModal>
            </>
          )}
          {isAuthenticated && (
            <Button
              colorScheme={colorMode === "dark" ? "black" : "white"}
              color={colorMode === "dark" ? "white" : "black"}
              ml={4}
              onClick={() => logout()}
            >
              Log out
            </Button>
          )}
        </Flex>
      </Flex>

      <VStack
        display={{ base: isOpen ? "flex" : "none", md: "none" }}
        align="start"
        spacing={4}
        p={4}
        bg={bg}
        color="white"
        position="fixed"
        top="3.5rem"  // Adjust as necessary to match the height of the navbar
        left="0"
        right="0"
        zIndex="999"
      >
        {isAuthenticated && (
          <Link to="/backtest" className="text-lg" onClick={handleLinkClick}>
            Backtest Strategies
          </Link>
        )}
        <Link to="/coins" className="text-lg" onClick={handleLinkClick}>
          Coin list
        </Link>

      </VStack>
    </>
  )
}

export default NavBar