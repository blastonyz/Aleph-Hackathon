import { Project } from "@/types/types";
//import ProjectsEvents from "../interactions/events/ProjectsEvents";

interface ProjectDetailProps {
  project: Project;
}


const ProjectDetailsCard = ({ project }: ProjectDetailProps) => {

  const {
    key,
    name,
    country,
    price,
    methodologies,
    sustainableDevelopmentGoals,
    short_description,
    url,
    satelliteImage,
  } = project;

  return (
    <div className="max-w-3xl mx-auto my-8 p-6 bg-white rounded-xl shadow-lg border border-gray-300 font-sans">
  <h2 className="text-2xl font-semibold mb-4">{name}</h2>

  {satelliteImage?.url && (
    <img
      src={satelliteImage.url}
      alt={satelliteImage.caption || "Satellite image"}
      className="w-full rounded-lg mb-4"
    />
  )}

  <p className="mb-2"><span className="font-semibold">Project Key:</span> {key}</p>
  <p className="mb-2"><span className="font-semibold">Country:</span> {country}</p>
  <p className="mb-4"><span className="font-semibold">Price:</span> ${parseFloat(price).toFixed(3)} / tonne</p>

  {methodologies.length > 0 && (
    <div className="mb-4">
      <span className="font-semibold">Methodologies:</span>
      <ul className="list-disc list-inside mt-2">
        {methodologies.map((method) => (
          <li key={method.id}>
            {method.name} ({method.category})
          </li>
        ))}
      </ul>
    </div>
  )}

  {sustainableDevelopmentGoals.length > 0 && (
    <p className="mb-4">
      <span className="font-semibold">SDGs:</span> {sustainableDevelopmentGoals.join(", ")}
    </p>
  )}

  <p className="mb-4">
    <span className="font-semibold">Short Description:</span><br />
    {short_description}
  </p>

  <p>
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-green-600 hover:underline font-medium"
    >
      View on Verra Registry
    </a>
  </p>

     {/*project.contractAddress &&
        <ProjectsEvents projectAddress={project.contractAddress} />
      */}
</div>
    );


}

export default ProjectDetailsCard;