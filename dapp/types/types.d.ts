import {Ethereum} from "@metamask/providers"
import { Contract } from "ethers"
import { ReactNode } from "react"


declare global {
  interface Window {
    ethereum?: Ethereum;
  }

  type WalletAddress = string | null;

  type Props = {
    children: ReactNode;    
  };

  type ContractABI = Contract | null;
}

export type Project = {
  _id:string;
  key: string;
  name: string;
  country: string;
  price: string;
  methodologies: {
    id: string;
    name: string;
    category: string;
  }[];
  sustainableDevelopmentGoals: string[];
  short_description: string;
  url: string;
  satelliteImage?: {
    caption: string;
    url: string;
  };
  registry: string;
  projectID: String;
  stats: {
    totalSupply: number;
    totalRetired: number;
  };
  isTokenized?: boolean;
  contractAddress?: string; 
  owner: string;
  paymentToken: string;
  retireContract: string;
  treasury: string;
  symbol: string;
  maxSupply: number;
  metadataURI: string;
};

export type ProjectsContextType = {
  projects: Project[];
  filterByCountry: (country: string) => Project[];
  selectProject: (key: string) => Project | null;
  filterByOwners: () => Project[] | null;
};

export type UpdateProject = {
  isTokenized?: boolean;
  owner?: string;
  contractAddress?: string;
  ipfsCID?: string;
  tokenizedAt?: Date;
};