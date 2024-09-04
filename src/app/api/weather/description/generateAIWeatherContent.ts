import { GenerateContentRequest, GoogleGenerativeAI, Part } from '@google/generative-ai';
import responseProperties from '../[slug]/response-properties.json';
import { promises as fs } from 'fs';
import path from 'path';

const AI_API_KEY = process.env.AI_API_KEY as string;
const genAI = new GoogleGenerativeAI(AI_API_KEY);

export const generateAIWeatherContent = async (
  content: GenerateContentRequest | string | Array<string | Part>,
  options: {
    locationAdress: string;
  },
) => {
  try {
    const filePath = path.resolve('public/static/instruction.txt');
    const templateInstruction = await fs.readFile(filePath, 'utf-8');

    const descriptionsList = responseProperties
      .map(({ Variable, Description, Unit }) => `- ${Variable}: ${Description} (Unit: ${Unit})`)
      .join('\n');

    const systemInstruction = templateInstruction
      .replace('${descriptionsList}', descriptionsList)
      .replace('${locationAdress}', options.locationAdress);

    const genModel = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction,
    });
    return genModel.generateContent(content);
  } catch (error) {
    throw new Error('Error generating content: ' + (error as Error).message);
  }
};
