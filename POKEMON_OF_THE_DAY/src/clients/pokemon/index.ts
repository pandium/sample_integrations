import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { Pokemon, PokemonType, PokemonTypeSearchResult } from "./models";
export default class Client {
  _axiosInstance: AxiosInstance;
  constructor() {
    this._axiosInstance = axios.create({
      baseURL: `https://pokeapi.co/api/v2/`,
    });
  }

  getPokemon = async (pokemonId: string) =>
    this.getResource("pokemon", pokemonId) as Promise<Pokemon>;
  getType = async (typeName: string) =>
    this.getResource("type", typeName) as Promise<PokemonType>;
  getTypes = async () =>
    this.getResource("type") as Promise<PokemonTypeSearchResult[]>;

  async getResource(resource: string, id?: number | string): Promise<unknown> {
    const limit = 50;
    const axiosConfig = {
      params: {
        limit: limit,
      },
    } as AxiosRequestConfig;

    let offset = 0;
    const resources: any[] = [];

    do {
      try {
        console.error(
          `Fetching ${offset} - ${
            offset + limit
          } of ${resource} records from PokéAPI`
        );
        const { data } = await this._axiosInstance.get(
          id ? `${resource}/${id}` : resource,
          {
            ...axiosConfig,
            params: {
              ...axiosConfig.params,
              offset: offset,
            },
          }
        );

        if (id) {
          return data;
        }

        resources.push(...data.results);
        if (!data.next) break;
        offset += limit;
      } catch (error) {
        console.error(
          `There was an error while attempting to fetch ${resource} ${
            id ? id : ""
          } from PokéAPI.`
        );
        console.error(error);
        return undefined;
      }
    } while (true);
    return resources;
  }
}
