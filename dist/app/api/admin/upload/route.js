"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const supabase_js_1 = require("@supabase/supabase-js");
const server_1 = require("next/server");
const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function POST(request) {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file) {
        return server_1.NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    const fileName = `public/${Date.now()}-${file.name}`;
    try {
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('post-images')
            .upload(fileName, file);
        if (uploadError) {
            console.error('Supabase upload error:', uploadError);
            return server_1.NextResponse.json({ error: `Failed to upload file: ${uploadError.message}` }, { status: 500 });
        }
        const { data: { publicUrl } } = supabase.storage
            .from('post-images')
            .getPublicUrl(uploadData.path);
        return server_1.NextResponse.json({ url: publicUrl });
    }
    catch (error) {
        console.error('Error uploading file:', error);
        return server_1.NextResponse.json({ error: 'An error occurred while uploading the file' }, { status: 500 });
    }
}
