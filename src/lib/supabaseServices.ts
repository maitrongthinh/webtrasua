import { supabase } from "./supabase";

export type MenuItem = {
    id: number;
    name: string;
    category: string;
    price: number;
    image: string;
    description: string;
    story?: string;
};

/**
 * Fetch all menu items, sorted by id ascending.
 */
export async function getMenuItems(): Promise<MenuItem[]> {
    const { data, error } = await supabase
        .from("menu_items")
        .select("id, name, category, price, image, description, story")
        .order("id", { ascending: true });

    if (error) {
        console.error("getMenuItems error:", error.message);
        return [];
    }

    return (data ?? []) as MenuItem[];
}

/**
 * Get unique categories from menu items, sorted alphabetically.
 */
export async function getCategories(): Promise<string[]> {
    const items = await getMenuItems();
    return Array.from(new Set(items.map((item) => item.category))).sort((a, b) =>
        a.localeCompare(b, "sk"),
    );
}

/**
 * Insert or update a menu item.
 * If item.id > 0, updates the existing row; otherwise inserts a new one.
 */
export async function saveMenuItem(
    item: Partial<MenuItem>,
): Promise<{ success: boolean; error?: string }> {
    const payload = {
        name: item.name?.trim() ? item.name : "Nový produkt",
        category: item.category?.trim() ? item.category : "Mliečny čaj",
        price: Number(item.price) || 0,
        image: item.image !== undefined ? item.image : "/assets/access-verified/drink-brown-sugar-daddy.png",
        description: item.description !== undefined ? item.description : "",
        story: item.story !== undefined ? item.story : "",
    };

    if (item.id && item.id > 0) {
        // Update existing
        const { error } = await supabase
            .from("menu_items")
            .update(payload)
            .eq("id", item.id);

        if (error) {
            return { success: false, error: error.message };
        }
    } else {
        // Insert new
        const { error } = await supabase.from("menu_items").insert(payload);

        if (error) {
            return { success: false, error: error.message };
        }
    }

    return { success: true };
}

/**
 * Delete a menu item by id.
 */
export async function deleteMenuItem(
    id: number,
): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase.from("menu_items").delete().eq("id", id);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}

/**
 * Upload an image to Supabase Storage bucket 'menu-images'.
 * Returns the public URL of the uploaded image.
 */
export async function uploadImage(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
        // Create a unique file name to avoid collisions
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `menu-items/${fileName}`;

        // Upload the file to the 'menu-images' bucket
        const { error: uploadError } = await supabase.storage
            .from("menu-images")
            .upload(filePath, file, {
                cacheControl: "3600",
                upsert: false,
            });

        if (uploadError) {
            return { success: false, error: uploadError.message };
        }

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
            .from("menu-images")
            .getPublicUrl(filePath);

        return { success: true, url: publicUrl };
    } catch (err: any) {
        return { success: false, error: err.message || "Nepodarilo sa nahrať obrázok" };
    }
}

/**
 * Fetch list of all images in the 'menu-images' bucket.
 */
export async function getUploadedImages(): Promise<{ name: string; url: string }[]> {
    const { data, error } = await supabase.storage
        .from("menu-images")
        .list("menu-items", {
            limit: 100,
            sortBy: { column: "created_at", order: "desc" },
        });

    if (error || !data) {
        console.error("getUploadedImages error:", error?.message);
        return [];
    }

    // Map file names to public URLs (skipping the empty '.emptyFolderPlaceholder' if it exists)
    const validFiles = data.filter(file => file.name !== ".emptyFolderPlaceholder");

    return validFiles.map((file) => {
        const { data: { publicUrl } } = supabase.storage
            .from("menu-images")
            .getPublicUrl(`menu-items/${file.name}`);
        return { name: file.name, url: publicUrl };
    });
}

/**
 * Delete an image from the 'menu-images' bucket.
 */
export async function deleteUploadedImage(fileName: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase.storage
        .from("menu-images")
        .remove([`menu-items/${fileName}`]);

    if (error) {
        return { success: false, error: error.message };
    }
    return { success: true };
}
