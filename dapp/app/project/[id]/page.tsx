import ProjectDetailContainer from "@/app/components/project/ProjectDetails";

export default async function page({params}: {params: {id: string}}){
        const {id} = await params;

         return (
        <div>
            <ProjectDetailContainer id={id} /> 
        </div>
    );
}