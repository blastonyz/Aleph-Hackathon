import { Project } from "@/types/types";
import Link from "next/link"
import { MapPin, DollarSign, TrendingUp, Leaf } from "lucide-react"
import DeployERC721 from "../../interactions/deploy721/DeployERC721";
import BuyNFT from "../../interactions/buy/BuyNFT";

type Props = {
    project:Project;
}

const ProjectCard = ({project}:Props) => {


     return (
    <div className="bg-white rounded-lg shadow-md border border-green-100 hover:shadow-lg transition-shadow overflow-hidden">
      <div className="p-6 border-b border-green-50">
        <div className="space-y-3">
          <div>
            <h3 className="text-xl font-semibold text-green-700 mb-2">{project.name}</h3>
            <div className="flex items-center text-green-600">
              <MapPin className="w-4 h-4 mr-2" />
              <h4 className="text-sm">Standard: {project.registry}</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Methodologies */}
        <div className="space-y-3">
          {project.methodologies?.map((methodology: any, index: number) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`px-3 py-1 rounded-full text-xs font-medium `}>
                {methodology.category}
              </div>
              <span className="text-sm text-green-700 font-medium">{methodology.name}</span>
            </div>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
          <DollarSign className="w-5 h-5 text-green-600" />
          <span className="text-green-700 font-medium">
            {project.price === "0" ? "Price not available" : `$${project.price} per credit`}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">Supply</span>
            </div>
            <p className="text-green-800 font-semibold">{project.stats?.totalSupply || "N/A"}</p>
          </div>

          <div className="p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Leaf className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">Retired</span>
            </div>
            <p className="text-green-800 font-semibold">{project.stats?.totalRetired || "N/A"}</p>
          </div>
        </div>

        {/* Links */}
        <div className="flex space-x-4">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-700 underline text-sm font-medium"
          >
            Visit Site
          </a>
          <Link
            href={`/project/${project._id}`}
            className="text-green-600 hover:text-green-700 underline text-sm font-medium"
          >
            View Details
          </Link>
        </div>

        {/* SDGs */}
        {project.sustainableDevelopmentGoals?.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium text-green-700">SDG:</span>
            <div className="flex flex-wrap gap-2">
              {project.sustainableDevelopmentGoals.map((sdg: string) => (
                <div key={sdg} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                  {sdg}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description Preview */}
        <p className="text-green-600 text-sm leading-relaxed">{project.short_description}</p>

          {project?.owner &&
           <p className="text-xs text-green-500">Owned by: {project.owner}
           </p>}

          {project.contractAddress &&
           <p className="text-xs text-green-500">Contract: {project.contractAddress}
           </p>}
        {!project.isTokenized &&  (
          <div className="pt-4 border-t border-green-100">
            <DeployERC721 project={project} />
          </div>
        )}

        {project.isTokenized && project.contractAddress && (
          <div className="pt-4 border-t border-green-100 space-y-3">
            {BuyNFT && <BuyNFT nftAddress={project.contractAddress} price={project.price} />}
            {/*project.RetireCredits && <project.RetireCredits tokenAddress={project.contractAddress} />*/}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectCard