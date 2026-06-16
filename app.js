async function totemOlustur() {
    const username = document.getElementById('username').value.trim();
    if (!username) return alert("Please enter a Minecraft username! 😛");

    const canvas = document.getElementById('totemCanvas');
    const ctx = canvas.getContext('2d');

    // 1. Step: Load the old classic totem template (16x16)
    const oldTotem = new Image();
    oldTotem.src = 'eski_totem_sablonu.png'; // This must match your template image name
    
    oldTotem.onload = async () => {
        // Clear canvas and draw the original old totem base
        ctx.clearRect(0, 0, 16, 16);
        ctx.drawImage(oldTotem, 0, 0);

        // 2. Step: Fetch the player's 8x8 skin head using Crafatar API
        const skinHead = new Image();
        skinHead.crossOrigin = "Anonymous"; // Prevents CORS security errors
        skinHead.src = `https://crafatar.com/avatars/${username}?size=8&overlay=true`;

        skinHead.onload = function() {
            // 3. Step: Overlay the player's head onto the classic totem's face area
            // In the old texture, the head area perfectly aligns at X:4, Y:2
            ctx.drawImage(skinHead, 4, 2, 8, 8);

            // 4. Step: Package everything automatically into a Texture Pack ZIP
            canvas.toBlob(function(blob) {
                const zip = new JSZip();
                
                // Constructing the precise Minecraft resource pack folder path
                const textures = zip.folder("assets").folder("minecraft").folder("textures").folder("item");
                textures.file("totem_of_undying.png", blob); // Inject the custom image

                // Injecting the mandatory pack.mcmeta file
                const mcmetaContent = JSON.stringify({
                    pack: {
                        pack_format: 15,
                        description: `Old Style Totem Pack for ${username}! 😛`
                    }
                }, null, 2);
                
                zip.file("pack.mcmeta", mcmetaContent);

                // Automatically trigger the ZIP download for the user
                zip.generateAsync({type:"blob"}).then(function(content) {
                    const element = document.createElement('a');
                    element.href = URL.createObjectURL(content);
                    element.download = `${username}_Old_Totem.zip`;
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                });
            });
        };

        skinHead.onerror = function() {
            alert("Could not fetch the skin for this username. Please check the name and try again! 😛");
        };
    };

    oldTotem.onerror = function() {
        alert("System error: Classic totem template missing in repository! 😛");
    };
}
