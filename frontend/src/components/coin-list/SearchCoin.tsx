import { InputGroup, InputLeftElement, Input } from "@chakra-ui/react"
import { useRef } from "react"
import { BsSearch } from "react-icons/bs"

import { useNavigate } from "react-router-dom"
import coinSearchQuery from "../../stores/coinSearchQueryStore"


const SearchCoin = () => {
  const ref = useRef<HTMLInputElement>(null)
  const {coinQuery, setSearchText} = coinSearchQuery()
  // const navigate = useNavigate()

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        setSearchText(ref.current?.value ?? "")
        // navigate("/")
      }}
    >
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <BsSearch />
        </InputLeftElement>
        <Input bg="grey.200"
          ref={ref}
          borderRadius={20}
          borderColor="teal.500"
          placeholder="Search coins"
          variant="filled"
        />
      </InputGroup>
    </form>
  )
}

export default SearchCoin
