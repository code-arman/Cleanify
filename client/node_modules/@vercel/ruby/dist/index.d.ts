import { BuildOptions } from '@vercel/build-utils';
export declare const version = 3;
export declare function build({ workPath, files, entrypoint, config, meta, }: BuildOptions): Promise<{
    output: import("@vercel/build-utils").Lambda;
}>;
