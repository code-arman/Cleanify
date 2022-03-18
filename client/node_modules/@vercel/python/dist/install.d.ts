import { Meta } from '@vercel/build-utils';
interface InstallRequirementArg {
    pythonPath: string;
    pipPath: string;
    dependency: string;
    version: string;
    workPath: string;
    meta: Meta;
    args?: string[];
}
export declare function installRequirement({ pythonPath, pipPath, dependency, version, workPath, meta, args, }: InstallRequirementArg): Promise<void>;
interface InstallRequirementsFileArg {
    pythonPath: string;
    pipPath: string;
    filePath: string;
    workPath: string;
    meta: Meta;
    args?: string[];
}
export declare function installRequirementsFile({ pythonPath, pipPath, filePath, workPath, meta, args, }: InstallRequirementsFileArg): Promise<void>;
export {};
