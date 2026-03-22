export async function mockAiRewrite(text: string, prompt: string): Promise<string> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('short')) {
    return text.split(' ').slice(0, Math.max(3, Math.floor(text.split(' ').length / 2))).join(' ') + '...';
  }
  
  if (lowerPrompt.includes('professional')) {
    return `Additionally, we have assessed that: ${text}. Please advise on the next steps.`;
  }
  
  if (lowerPrompt.includes('fix') || lowerPrompt.includes('spell')) {
    return text.replace(/teh/g, 'the').replace(/don;t/g, "don't");
  }

  // Generic fallback if standard prompts don't match
  return `✨ AI rewritten version of: "${text}" ✨`;
}
