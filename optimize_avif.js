import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const targetDir = 'c:/Users/berol/OneDrive/Desktop/lend/src/assets/images';

async function optimizeAvif() {
    try {
        const files = fs.readdirSync(targetDir).filter(file => file.endsWith('.avif'));
        
        console.log(`Found ${files.length} AVIF files. Starting optimization...`);
        
        for (const file of files) {
            const filePath = path.join(targetDir, file);
            const tempPath = filePath + '.tmp';
            
            const statsBefore = fs.statSync(filePath);
            
            await sharp(filePath)
                .avif({ quality: 40 })
                .toFile(tempPath);
            
            const statsAfter = fs.statSync(tempPath);
            
            // Заменяем оригинальный файл новым
            fs.renameSync(tempPath, filePath);
            
            console.log(`Optimized: ${file} | ${(statsBefore.size / 1024).toFixed(1)}KB -> ${(statsAfter.size / 1024).toFixed(1)}KB`);
        }
        
        console.log('All AVIF files have been optimized to 40% quality.');
    } catch (err) {
        console.error('Error during optimization:', err);
    }
}

optimizeAvif();
