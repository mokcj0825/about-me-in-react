import { promises as fs } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = fileURLToPath(new URL('.', import.meta.url));

const BASE_DIR = resolve(__dirname, '..');
const PREVIEW_DIR = join(BASE_DIR, 'preview');
const INSTRUCTIONS_DIR = join(BASE_DIR, 'instructions');
const BLESSINGS_DIR = join(BASE_DIR, 'blessings');

interface BlessingPreview {
  id: string;
  name: string;
  path: string;
  description: string;
  rarity: number;
  category: string;
}

async function moveFiles() {
  try {
    // Read all preview files to get path information
    const previewFiles = await fs.readdir(PREVIEW_DIR);

    for (const file of previewFiles) {
      if (!file.endsWith('.json')) continue;

      const previewPath = join(PREVIEW_DIR, file);
      const previewContent = await fs.readFile(previewPath, 'utf-8');
      const blessing = JSON.parse(previewContent) as BlessingPreview;
      const blessingPath = blessing.path.toLowerCase();

      // Create directories if they don't exist
      const newPreviewDir = join(BLESSINGS_DIR, blessingPath, 'preview');
      const newInstructionsDir = join(BLESSINGS_DIR, blessingPath, 'instructions');
      await fs.mkdir(newPreviewDir, { recursive: true });
      await fs.mkdir(newInstructionsDir, { recursive: true });

      // Move preview file
      await fs.copyFile(previewPath, join(newPreviewDir, file));

      // Move instruction file if it exists
      const instructionFile = join(INSTRUCTIONS_DIR, file);
      try {
        await fs.access(instructionFile);
        await fs.copyFile(instructionFile, join(newInstructionsDir, file));
      } catch (error) {
        // Instruction file doesn't exist, skip it
        continue;
      }
    }

    console.log('Files moved successfully!');
  } catch (error) {
    console.error('Error moving files:', error);
    process.exit(1);
  }
}

moveFiles(); 