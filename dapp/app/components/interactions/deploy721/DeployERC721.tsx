'use client'
import { useState } from 'react'
import { useWallet } from '@/app/context/ConnectionProvider'
import { Project } from '@/types/types';
import { buildMetadata, buildDeployParamsFromProject, deployProject } from './DeployFunctions';
import { addrGHToken, addrCarbonRetire, addrCarbonFactory } from '@/contracts/adresses';
import { Contract } from 'ethers';
import CarbonFactory from '@contracts/CarbonFactory.sol/CarbonFactory.json'

type Props = {
    project: Project;
};

//falta signer

const DeployERC721 = ({ project }: Props) => {
    const { mainProvider, account, mainSigner } = useWallet()
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<null | {
        address: string;
        projectId: number;
        owner: string;
        txHash: string;
    }>(null);
    const [error, setError] = useState<string | null>(null);

    const factoryContract = new Contract(addrCarbonFactory, CarbonFactory.abi, mainSigner)

    const handleDeploy = async () => {
        setLoading(true);
        setError(null);
        setResult(null);



        if (!account) {
            setError("Wallet not connected");
            return;
        }

        const metadata = buildMetadata(project);
        console.log("Metadata to upload:", metadata);

        const res = await fetch("/api/files", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(metadata),
        });
        const uploadResponse = await res.json();
        console.log("IPFS upload response:", uploadResponse);
        const { cid } = uploadResponse;

        if (!cid) throw new Error("No CID returned");

        if (!mainSigner || !addrCarbonFactory) {
            setError("Signer or contract address not available");
            return;
        }


        const deployParams = buildDeployParamsFromProject(
            project,
            account,
            cid,
            addrGHToken,
            addrCarbonRetire,
            factoryContract
        );
        console.log("Deploy params:", deployParams);
        try {
            const res = await deployProject(deployParams);
            console.log("Deploy result:", res);
            setResult(res);

            if (res.txHash && res.address) {
                console.log('contract address', res.address);
                console.log('prev fetch cid: ', cid);
                const updateRes = await fetch(`/api/project/${project._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        isTokenized: true,
                        owner: account,
                        contractAddress: res.address,
                        ipfsCID: cid
                    }),
                });
                const updateData = await updateRes.json();
                console.log("Update project result:", updateData);
            }


        } catch (err: any) {
            setError(err.message || "Error deploying contract");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 border border-gray-300 rounded-lg bg-white">
            <button
                onClick={handleDeploy}
                disabled={loading || !mainProvider}
                className={`px-4 py-2 rounded font-semibold transition ${loading || !mainProvider
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
            >
                {loading ? "Deploying..." : "Tokenize"}
            </button>

            {error && (
                <p className="mt-4 text-red-600 font-medium">❌ {error}</p>
            )}

            {result && (
                <div className="mt-4 bg-gray-50 p-4 rounded shadow-sm text-sm text-gray-800">
                    <p className="font-semibold text-green-700 mb-2">✅ Token deployed!</p>
                    <p><span className="font-semibold">Address:</span> {result.address}</p>
                    <p><span className="font-semibold">Project ID:</span> {result.projectId}</p>
                    <p><span className="font-semibold">Owner:</span> {result.owner}</p>
                    <p><span className="font-semibold">Tx Hash:</span> {result.txHash}</p>
                </div>
            )}
        </div>
    );

}

export default DeployERC721