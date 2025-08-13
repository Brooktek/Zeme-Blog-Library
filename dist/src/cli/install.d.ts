interface InstallOptions {
    force?: boolean;
    skipDeps?: boolean;
}
export declare function installBlog(options?: InstallOptions): Promise<void>;
export {};
