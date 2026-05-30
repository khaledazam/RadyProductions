import { c as createComponent } from './astro-component_C1Eacmxp.mjs';
import 'piccolore';
import { s as renderHead, q as renderComponent, u as renderTemplate, j as addAttribute } from './entrypoint_Bw6XB4lw.mjs';
import { r as renderScript } from './script_BWQzGnP6.mjs';
/* empty css                 */
import { s as supabase, a as supabaseAdmin } from './supabase_D9l0lVjm.mjs';
import { A as ArrowLeft, U as Upload, S as Save } from './upload_B_ByltB0.mjs';

const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$id;
  const accessToken = Astro2.cookies.get("sb-access-token")?.value;
  const refreshToken = Astro2.cookies.get("sb-refresh-token")?.value;
  if (!accessToken || !refreshToken) {
    return Astro2.redirect("/login");
  }
  const { data: sessionData, error: sessionErr } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken
  });
  if (sessionErr || !sessionData.user) {
    Astro2.cookies.delete("sb-access-token", { path: "/" });
    Astro2.cookies.delete("sb-refresh-token", { path: "/" });
    return Astro2.redirect("/login");
  }
  const { id } = Astro2.params;
  if (!id) {
    return Astro2.redirect("/admin");
  }
  const { data: item, error: fetchErr } = await supabase.from("portfolio_items").select("*").eq("id", id).single();
  if (fetchErr || !item) {
    return Astro2.redirect("/admin");
  }
  let errorMsg = "";
  let successMsg = "";
  if (Astro2.request.method === "POST") {
    try {
      const formData = await Astro2.request.formData();
      const title = formData.get("title")?.toString().trim();
      const title_ar = formData.get("title_ar")?.toString().trim();
      const category = formData.get("category")?.toString().trim();
      const video_url = formData.get("video_url")?.toString().trim();
      const location = formData.get("location")?.toString().trim();
      const location_ar = formData.get("location_ar")?.toString().trim();
      const image_url_fallback = formData.get("image_url")?.toString().trim();
      const image_file = formData.get("image_file");
      if (!title || !title_ar || !category || !video_url || !location || !location_ar) {
        errorMsg = "All fields (except Image Upload) are required.";
      } else {
        let finalImageUrl = image_url_fallback || item.image;
        if (image_file && image_file.size > 0) {
          const { data: buckets } = await supabaseAdmin.storage.listBuckets();
          if (!buckets?.find((b) => b.name === "portfolio-thumbnails")) {
            await supabaseAdmin.storage.createBucket("portfolio-thumbnails", { public: true });
          }
          const fileExt = image_file.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
          const arrayBuffer = await image_file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const { data: uploadData, error: uploadErr } = await supabaseAdmin.storage.from("portfolio-thumbnails").upload(fileName, buffer, {
            contentType: image_file.type
          });
          if (uploadErr) {
            throw new Error(`Thumbnail upload failed: ${uploadErr.message}`);
          }
          const { data: urlData } = supabaseAdmin.storage.from("portfolio-thumbnails").getPublicUrl(fileName);
          const oldImage = item.image;
          finalImageUrl = urlData.publicUrl;
          if (oldImage && oldImage.includes("portfolio-thumbnails")) {
            const fileUrlParts = oldImage.split("portfolio-thumbnails/");
            if (fileUrlParts.length > 1) {
              const filePath = fileUrlParts[1];
              await supabaseAdmin.storage.from("portfolio-thumbnails").remove([filePath]);
            }
          }
        }
        const { error: updateErr } = await supabase.from("portfolio_items").update({
          title,
          title_ar,
          category,
          image: finalImageUrl,
          video_url,
          location,
          location_ar
        }).eq("id", id);
        if (updateErr) {
          errorMsg = `Failed to update work in database: ${updateErr.message}`;
        } else {
          successMsg = "Film successfully updated!";
          return Astro2.redirect("/admin");
        }
      }
    } catch (err) {
      errorMsg = err.message || "An unexpected error occurred.";
    }
  }
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>RADY Productions | Edit Film</title><!-- Google Fonts --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Montserrat:wght@200;300;400;500;600;700&display=swap" rel="stylesheet">${renderHead()}</head> <body class="bg-brand-matte min-h-screen font-sans text-brand-ivory p-6 md:p-12 relative"> <!-- Grid Background --> <div class="absolute inset-0 z-0 pointer-events-none opacity-[0.01] bg-[linear-gradient(to_right,#C7A76A_1px,transparent_1px),linear-gradient(to_bottom,#C7A76A_1px,transparent_1px)] bg-[size:40px_40px]"></div> <div class="max-w-4xl mx-auto relative z-10 space-y-8"> <!-- Back button and title --> <div class="space-y-4 border-b border-brand-charcoal pb-6"> <a href="/admin" class="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-brand-gold hover:text-brand-ivory transition-colors duration-300"> ${renderComponent($$result, "ArrowLeft", ArrowLeft, { "class": "w-3.5 h-3.5" })} <span>Back to Control Room</span> </a> <div> <span class="text-xs tracking-[0.4em] uppercase text-brand-gold font-semibold mb-1 block">
Edit Creation
</span> <h1 class="font-serif text-3xl font-bold tracking-wide">
Edit: ${item.title} </h1> </div> </div> <!-- Messages --> ${errorMsg && renderTemplate`<div class="p-4 bg-red-950/40 border border-red-500/30 text-red-200 text-sm tracking-wide"> ${errorMsg} </div>`} ${successMsg && renderTemplate`<div class="p-4 bg-green-950/40 border border-green-500/30 text-green-200 text-sm tracking-wide"> ${successMsg} </div>`} <!-- Form Card --> <div class="bg-brand-charcoal/20 border border-brand-charcoal p-8 relative overflow-hidden"> <!-- Golden Top Border Accent --> <div class="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent"></div> <form method="POST" enctype="multipart/form-data" class="space-y-8"> <!-- Title Row (English and Arabic) --> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"> <!-- English Title --> <div class="space-y-2"> <label for="title" class="block text-[10px] tracking-widest uppercase text-brand-gold font-medium">
English Title / العنوان بالإنجليزية
</label> <input type="text" id="title" name="title" required${addAttribute(item.title, "value")} placeholder="e.g. Gabriella & Alessandro" class="w-full bg-brand-matte/50 border border-brand-charcoal px-4 py-3 text-sm focus:outline-none focus:border-brand-gold/50 text-brand-ivory transition-all duration-300"> </div> <!-- Arabic Title --> <div class="space-y-2"> <label for="title_ar" class="block text-[10px] tracking-widest uppercase text-brand-gold font-medium text-right">
العنوان بالعربية / Arabic Title
</label> <input type="text" id="title_ar" name="title_ar" required${addAttribute(item.title_ar, "value")} dir="rtl" placeholder="مثال: غابرييلا وأليساندرو" class="w-full bg-brand-matte/50 border border-brand-charcoal px-4 py-3 text-sm focus:outline-none focus:border-brand-gold/50 text-brand-ivory transition-all duration-300 text-right font-serif"> </div> </div> <!-- Category and Video URL --> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"> <!-- Category --> <div class="space-y-2"> <label for="category" class="block text-[10px] tracking-widest uppercase text-brand-gold font-medium">
Category / تصنيف العمل
</label> <select id="category" name="category" required class="w-full bg-brand-matte/50 border border-brand-charcoal px-4 py-3 text-sm focus:outline-none focus:border-brand-gold/50 text-brand-ivory transition-all duration-300 cursor-pointer"> <option value="weddings"${addAttribute(item.category === "weddings", "selected")} class="bg-brand-matte">Weddings (أفراح ومناسبات)</option> <option value="commercials"${addAttribute(item.category === "commercials", "selected")} class="bg-brand-matte">Commercials (إعلانات تجارية)</option> <option value="corporate"${addAttribute(item.category === "corporate", "selected")} class="bg-brand-matte">Corporate (أعمال شركات ومؤتمرات)</option> <option value="bts"${addAttribute(item.category === "bts", "selected")} class="bg-brand-matte">Behind The Scenes (كواليس وأدوات)</option> </select> </div> <!-- Video URL --> <div class="space-y-2"> <label for="video_url" class="block text-[10px] tracking-widest uppercase text-brand-gold font-medium">
Video URL (Direct MP4, Vimeo, YouTube) / رابط الفيديو
</label> <input type="url" id="video_url" name="video_url" required${addAttribute(item.video_url, "value")} placeholder="https://player.vimeo.com/... or https://..." class="w-full bg-brand-matte/50 border border-brand-charcoal px-4 py-3 text-sm focus:outline-none focus:border-brand-gold/50 text-brand-ivory transition-all duration-300 font-mono"> </div> </div> <!-- Location Row (English and Arabic) --> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"> <!-- English Location --> <div class="space-y-2"> <label for="location" class="block text-[10px] tracking-widest uppercase text-brand-gold font-medium">
Location / الموقع بالإنجليزية
</label> <input type="text" id="location" name="location" required${addAttribute(item.location, "value")} placeholder="e.g. Tuscany, Italy or Cairo, Egypt" class="w-full bg-brand-matte/50 border border-brand-charcoal px-4 py-3 text-sm focus:outline-none focus:border-brand-gold/50 text-brand-ivory transition-all duration-300"> </div> <!-- Arabic Location --> <div class="space-y-2"> <label for="location_ar" class="block text-[10px] tracking-widest uppercase text-brand-gold font-medium text-right">
الموقع بالعربية / Arabic Location
</label> <input type="text" id="location_ar" name="location_ar" required${addAttribute(item.location_ar, "value")} dir="rtl" placeholder="مثال: القاهرة، مصر أو توسكانا، إيطاليا" class="w-full bg-brand-matte/50 border border-brand-charcoal px-4 py-3 text-sm focus:outline-none focus:border-brand-gold/50 text-brand-ivory transition-all duration-300 text-right font-serif"> </div> </div> <!-- Image Selection (File Upload & URL Link) --> <div class="space-y-4 pt-4 border-t border-brand-charcoal/50"> <h3 class="font-serif text-sm font-semibold tracking-wider text-brand-gold">
Film Thumbnail Image / غلاف الفيلم
</h3> <!-- Current Thumbnail Preview --> <div class="flex items-center gap-4 p-4 bg-brand-matte/40 border border-brand-charcoal"> <div class="w-24 aspect-[16/10] bg-black border border-brand-charcoal overflow-hidden flex-shrink-0"> <img${addAttribute(item.image, "src")} alt="Current Thumbnail" class="w-full h-full object-cover"> </div> <div class="text-xs"> <div class="font-semibold text-brand-gold">Current Image Target</div> <div class="text-brand-ivory/40 truncate max-w-md font-mono mt-1">${item.image}</div> </div> </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2"> <!-- Drag and drop File Uploader --> <div class="space-y-2"> <label class="block text-[10px] tracking-widest uppercase text-brand-gold font-medium">
Option A: Upload New Image / رفع غلاف بديل
</label> <div class="w-full border border-dashed border-brand-charcoal hover:border-brand-gold/50 bg-brand-matte/30 p-6 text-center cursor-pointer transition-colors duration-300 relative group min-h-[140px] flex flex-col justify-center items-center gap-2"> <input type="file" id="image_file" name="image_file" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"> ${renderComponent($$result, "Upload", Upload, { "class": "w-8 h-8 text-brand-gold/60 group-hover:text-brand-gold transition-colors duration-300" })} <div class="text-xs text-brand-ivory/80" id="file-label">Drag & drop new file, or click to browse</div> <div class="text-[9px] text-brand-gold/40">PNG, JPG, WEBP up to 5MB</div> </div> </div> <!-- Paste Image URL --> <div class="space-y-2 flex flex-col justify-between"> <div class="space-y-2"> <label for="image_url" class="block text-[10px] tracking-widest uppercase text-brand-gold font-medium">
Option B: Change Image URL / تغيير الرابط
</label> <input type="text" id="image_url" name="image_url"${addAttribute(item.image.includes("portfolio-thumbnails") ? "" : item.image, "value")} placeholder="https://example.com/image.png" class="w-full bg-brand-matte/50 border border-brand-charcoal px-4 py-3 text-sm focus:outline-none focus:border-brand-gold/50 text-brand-ivory transition-all duration-300 font-mono"> </div> <div class="text-[10px] text-brand-gold/40 leading-relaxed">
* Note: Leave Option A empty if you want to keep the current image or if you are editing Option B's URL. Uploading a file automatically replaces the current image.
</div> </div> </div> </div> <!-- Submit Button --> <div class="pt-6 border-t border-brand-charcoal/50 flex justify-end"> <button type="submit" class="flex items-center gap-2 px-6 py-3.5 bg-brand-gold hover:bg-brand-gold/90 text-brand-matte text-xs tracking-widest uppercase transition-all duration-300 font-bold shadow-[0_4px_20px_rgba(199,167,106,0.15)] cursor-pointer"> ${renderComponent($$result, "Save", Save, { "class": "w-4 h-4" })} <span>Save Changes</span> </button> </div> </form> </div> </div> <!-- Script to handle file uploader UX --> ${renderScript($$result, "D:/rady/src/pages/admin/edit/[id].astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
}, "D:/rady/src/pages/admin/edit/[id].astro", void 0);

const $$file = "D:/rady/src/pages/admin/edit/[id].astro";
const $$url = "/admin/edit/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
      __proto__: null,
      default: $$id,
      file: $$file,
      url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
