/** Score level used across the app: Bland / Needs Tadka / Full Masala */
export function scoreLevel(score) {
  if (score < 50) {
    return { label: 'Bland', ring: '#E34B36', text: 'text-chilli-dark', bg: 'bg-chilli-light', bar: 'bg-chilli-bright' };
  }
  if (score < 75) {
    return { label: 'Needs Tadka', ring: '#F4C542', text: 'text-turmeric-dark', bg: 'bg-turmeric-light', bar: 'bg-turmeric' };
  }
  return { label: 'Full Masala', ring: '#54866A', text: 'text-leaf', bg: 'bg-leaf-light', bar: 'bg-leaf-bright' };
}

export const PRIORITY_STYLES = {
  High: 'bg-chilli-light text-chilli-dark',
  Medium: 'bg-turmeric-light text-turmeric-dark',
  Low: 'bg-leaf-light text-leaf-dark',
};
