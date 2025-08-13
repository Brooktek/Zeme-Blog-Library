export declare class BlogApiClient {
    static getPosts(params?: {
        limit?: number;
        category?: string;
        tag?: string;
        status?: string;
    }): Promise<any>;
    static getPost(id: string): Promise<any>;
    static getPostBySlug(slug: string): Promise<any>;
    static createPost(data: any): Promise<any>;
    static updatePost(id: string, data: any): Promise<any>;
    static deletePost(id: string): Promise<any>;
    static getCategories(): Promise<any>;
    static createCategory(data: {
        name: string;
        slug: string;
        description?: string;
    }): Promise<any>;
    static updateCategory(id: string, data: {
        name: string;
        slug: string;
        description?: string;
    }): Promise<any>;
    static deleteCategory(id: string): Promise<any>;
    static getTags(): Promise<any>;
    static createTag(data: {
        name: string;
        slug: string;
    }): Promise<any>;
    static updateTag(id: string, data: {
        name: string;
        slug: string;
    }): Promise<any>;
    static deleteTag(id: string): Promise<any>;
    static getStats(): Promise<any>;
}
