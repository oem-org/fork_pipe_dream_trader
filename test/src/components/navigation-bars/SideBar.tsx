import { Box, useColorModeValue } from "@chakra-ui/react"

interface SideBarProps {
  children: React.ReactNode
}

export default function SideBar( {children} : SideBarProps) {
  const bgColor = useColorModeValue('gray.100', 'gray.800');

  return (
    <>
      <Box bg={bgColor} h="100%" p={3}>
        {children}
      </Box>
    </>
  )
}