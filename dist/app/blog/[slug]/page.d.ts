export default function BlogPostPage({ params }: {
    params: {
        slug: string;
    };
}): import("react").JSX.Element;
export declare function generateMetadata({ params }: {
    params: {
        slug: string;
    };
}): Promise<{
    title: string;
    description?: undefined;
} | {
    title: string;
    description: string | null;
}>;
