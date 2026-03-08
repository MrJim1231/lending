import os
import re
from PIL import Image

def convert_to_webp(directory):
    # Supported formats to convert
    extensions = ('.png', '.jpg', '.jpeg')
    converted_files = {}

    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(extensions):
                source_path = os.path.join(root, file)
                
                # Create webp filename
                base_name = os.path.splitext(file)[0]
                webp_name = base_name + '.webp'
                dest_path = os.path.join(root, webp_name)
                
                print(f"Converting {file} to {webp_name}...")
                try:
                    with Image.open(source_path) as img:
                        # Save as webp with high quality to ensure they don't "change in parameters" visually
                        img.save(dest_path, 'WEBP', quality=90, lossless=False)
                    
                    # Store mapping for replacement
                    converted_files[file] = webp_name
                    print(f"Successfully converted {file}")
                except Exception as e:
                    print(f"Failed to convert {file}: {e}")
    
    return converted_files

def update_references(root_dir, mapping):
    # Files to update
    targets = ['index.html', 'src/styles/style.css']
    
    for relative_path in targets:
        file_path = os.path.join(root_dir, relative_path)
        if not os.path.exists(file_path):
            print(f"File not found: {file_path}")
            continue
            
        print(f"Updating references in {relative_path}...")
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original_content = content
        for old_name, new_name in mapping.items():
            # Replace occurrences of the old filename with the webp version
            # Using regex to catch things like "images/hero.png" -> "images/hero.webp"
            content = content.replace(old_name, new_name)
            
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated {relative_path}")
        else:
            print(f"No changes needed in {relative_path}")

if __name__ == "__main__":
    # Get project root (current directory where script is run)
    project_root = os.getcwd()
    assets_dir = os.path.join(project_root, 'src', 'assets', 'images')
    
    if os.path.exists(assets_dir):
        mapping = convert_to_webp(assets_dir)
        if mapping:
            update_references(project_root, mapping)
            print("\nOptimization complete!")
            print(f"Converted {len(mapping)} images.")
        else:
            print("No images found to convert.")
    else:
        print(f"Assets directory not found at {assets_dir}")
