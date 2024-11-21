import { Menu, MenuButton, Button, MenuList, MenuItem } from "@chakra-ui/react"
import { BsChevronDown } from "react-icons/bs"

import coinQueryStore from "../../stores/coinSearchQueryStore"

const SortSelector = () => {
  const sortOrder = coinQueryStore((state) => state.coinQuery.sortOrder)
  const setSortOrder = coinQueryStore((state) => state.setSortOrder)

  const sortOrders = [
    { value: "name", name: "Name" },
  ]

  const selectedSortOrder = sortOrders.find(
    (order) => order.value === sortOrder
  )

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<BsChevronDown />}>
        Order by: {selectedSortOrder?.name ?? "Relevance"}
      </MenuButton>
      <MenuList>
        {sortOrders.map((order) => (
          <MenuItem key={order.value} onClick={() => setSortOrder(order.value)}>
            {order.name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}

export default SortSelector
