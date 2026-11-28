export const capabilities = ['text', 'reasoning', 'coding', 'vision', 'audio', 'video', 'agents', 'embeddings'] as const;
export const availability = ['api', 'consumer-chat', 'open-weights', 'cloud-marketplace', 'self-hosted'] as const;
export const openness = ['proprietary', 'open-weights', 'hybrid'] as const;

const names: Record<string, string> = {
  api: 'API',
  'consumer-chat': 'Consumer chat',
  'open-weights': 'Open weights',
  'cloud-marketplace': 'Cloud marketplace',
  'self-hosted': 'Self-hosted',
};

export const label = (value: string) => names[value] ?? value.charAt(0).toUpperCase() + value.slice(1);
