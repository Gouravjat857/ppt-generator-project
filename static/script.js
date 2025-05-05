document.getElementById("pptForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const topic = document.getElementById("topic").value;
    const numSlides = document.getElementById("num_slides").value;
    const detailLevel = document.getElementById("detail_level").value;
    const style = document.getElementById("style").value;

    const formData = new URLSearchParams();
    formData.append("topic", topic);
    formData.append("num_slides", numSlides);
    formData.append("detail_level", detailLevel);
    formData.append("style", style);

    const preview = document.getElementById("preview");
    const container = document.getElementById("slideContainer");
    const loader = document.getElementById("loading");
    const downloadSection = document.getElementById("downloadSection");

    container.innerHTML = "";
    preview.classList.add("hidden");
    loader.classList.remove("hidden");
    downloadSection.classList.add("hidden");

    try {
        const res = await fetch("/generate", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData
        });

        const result = await res.json();

        if (result.error) {
            alert(result.error);
            loader.classList.add("hidden");
            return;
        }

        // Show slides with selected styling
        result.slides.forEach(slide => {
            const div = document.createElement("div");
            div.className = "p-4 border rounded";
        
            switch (style) {
                case "classic":
                    div.classList.add("bg-white", "text-gray-800");
                    break;
                case "modern":
                    div.classList.add("bg-blue-50", "text-blue-800", "shadow-md");
                    break;
                case "dark":
                    div.classList.add("bg-gray-800", "text-white");
                    break;
            }
        
            const title = document.createElement("h3");
            title.className = "text-lg font-semibold mb-2";
            title.innerText = slide.title;
        
            const ul = document.createElement("ul");
            ul.className = "list-disc list-inside";
            slide.bullets.forEach(bullet => {
                const li = document.createElement("li");
                li.innerText = bullet;
                ul.appendChild(li);
            });
        
            div.appendChild(title);
            div.appendChild(ul);
            container.appendChild(div);
        });

        preview.classList.remove("hidden");
        loader.classList.add("hidden");

        // ✅ Show only manual download button
        if (result.ppt_file) {
            downloadSection.classList.remove("hidden");
        }

    } catch (err) {
        loader.classList.add("hidden");
        alert("Error generating slides. Try again.");
        console.error(err);
    }
});

// ✅ Manual Download Button
document.getElementById("downloadBtn").addEventListener("click", function () {
    const link = document.createElement("a");
    link.href = "/download";
    link.download = "AI_Presentation.pptx";
    link.click();
});
