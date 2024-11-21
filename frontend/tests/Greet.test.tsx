import { it, expect, describe } from "vitest"
import { render, screen } from "@testing-library/react"
import Greet from "../src/components/Greet"
describe("Greet", () => {
  it("should render Hello with the name when name is provided", () => {})
  render(<Greet name="Tomas" />)
  const heading = screen.getByRole("heading")
  expect(heading).toBeInTheDocument()
  expect(heading).toHaveTextContent(/tomas/i)

  screen.debug()
})
