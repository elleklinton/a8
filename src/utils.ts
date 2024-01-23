export function titleCase(str: string): string {
    return str
        .replace('_', ' ')
        .split(' ')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' ')
}
