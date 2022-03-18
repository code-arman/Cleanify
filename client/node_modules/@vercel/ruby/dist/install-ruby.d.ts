import { Meta } from '@vercel/build-utils';
export declare function installBundler(meta: Meta, gemfileContents: string): Promise<{
    gemHome: string;
    rubyPath: string;
    gemPath: string;
    vendorPath: string;
    runtime: string;
    bundlerPath: string;
}>;
