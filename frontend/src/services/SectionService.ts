import axios from "axios"
import Section from "../models/Section"
import GridItem from "../models/GridItem"

class SectionService {
  http = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  })

  async getAll(): Promise<Section[]> {
    const response = await this.http.get<string[]>("sections")
    return response.data.map((item: string) => JSON.parse(item))
  }

  async getById(id: number): Promise<Section> {
    const response = await this.http.get<string>(`sections/${id}`)
    return JSON.parse(response.data)
  }

  async create(data: GridItem[] ) {
    const response = await this.http.post<string>("sections", {
        GridConfig: JSON.stringify(data),
    })
    return JSON.parse(response.data)
  }

  async delete(id: string): Promise<void> {
    await this.http.delete(`sections/${id}`)
  }
}

export default new SectionService()
